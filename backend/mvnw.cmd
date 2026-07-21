<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements. See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.
@REM
@REM Licensed under the Apache License, Version 2.0.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET "__MVNW_CMD__="
@SET "__MVNW_PSMODULEP_SAVE=%PSModulePath%"
@SET "PSModulePath="

@FOR /F "usebackq tokens=1* delims==" %%A IN (`powershell -noprofile "& {$scriptDir='%~dp0'; $script='%__MVNW_ARG0_NAME__%'; icm -ScriptBlock ([Scriptblock]::Create((Get-Content -Raw '%~f0'))) -NoNewScope}"`) DO @(
    IF "%%A"=="MVN_CMD" (
        SET "__MVNW_CMD__=%%B"
    ) ELSE IF "%%B"=="" (
        ECHO %%A
    ) ELSE (
        ECHO %%A=%%B
    )
)

@SET "PSModulePath=%__MVNW_PSMODULEP_SAVE%"
@SET "__MVNW_PSMODULEP_SAVE="
@SET "__MVNW_ARG0_NAME__="
@SET "MVNW_USERNAME="
@SET "MVNW_PASSWORD="

@IF NOT "%__MVNW_CMD__%"=="" ("%__MVNW_CMD__%" %*)

@ECHO Não foi possível iniciar o Maven Wrapper. 1>&2
@EXIT /B 1

@GOTO :EOF
: end batch / begin powershell #>

$ErrorActionPreference = "Stop"

if ($env:MVNW_VERBOSE -eq "true") {
    $VerbosePreference = "Continue"
}

$wrapperPropertiesPath = Join-Path `
    $scriptDir `
    ".mvn\wrapper\maven-wrapper.properties"

if (-not (Test-Path -LiteralPath $wrapperPropertiesPath)) {
    Write-Error "Arquivo não encontrado: $wrapperPropertiesPath"
}

$wrapperProperties = Get-Content `
    -Raw `
    -LiteralPath $wrapperPropertiesPath |
    ConvertFrom-StringData

$distributionUrl = $wrapperProperties.distributionUrl

if ([string]::IsNullOrWhiteSpace($distributionUrl)) {
    Write-Error "A propriedade distributionUrl não foi encontrada em $wrapperPropertiesPath"
}

switch -Wildcard -CaseSensitive ($distributionUrl -replace '^.*/', '') {
    "maven-mvnd-*" {
        $useMvnd = $true
        $distributionUrl = $distributionUrl `
            -replace '-bin\.[^.]*$', '-windows-amd64.zip'
        $mavenCommand = "mvnd.cmd"
        break
    }

    default {
        $useMvnd = $false
        $mavenCommand = $script -replace '^mvnw', 'mvn'
        break
    }
}

if ($env:MVNW_REPOURL) {
    $repositoryPattern = if ($useMvnd) {
        "/maven/mvnd/"
    } else {
        "/org/apache/maven/"
    }

    $distributionUrl = (
        "$env:MVNW_REPOURL" +
        "$repositoryPattern" +
        ($distributionUrl -replace "^.*$repositoryPattern", '')
    )
}

$distributionFileName = $distributionUrl -replace '^.*/', ''

$distributionDirectoryName = $distributionFileName `
    -replace '\.[^.]*$', '' `
    -replace '-bin$', ''

if (
    [string]::IsNullOrWhiteSpace($distributionDirectoryName) -or
    $distributionFileName -eq $distributionDirectoryName
) {
    Write-Error "distributionUrl inválida: $distributionUrl"
}

$mavenUserDirectory = Join-Path $HOME ".m2"

if ($env:MAVEN_USER_HOME) {
    $mavenUserDirectory = $env:MAVEN_USER_HOME
}

if (-not (Test-Path -LiteralPath $mavenUserDirectory)) {
    New-Item `
        -Path $mavenUserDirectory `
        -ItemType Directory `
        -Force |
        Out-Null
}

$mavenWrapperDistributions = Join-Path `
    $mavenUserDirectory `
    "wrapper\dists"

$mavenHomeParent = Join-Path `
    $mavenWrapperDistributions `
    $distributionDirectoryName

$distributionUrlBytes = [Text.Encoding]::UTF8.GetBytes(
    $distributionUrl
)

$hashAlgorithm = [Security.Cryptography.SHA256]::Create()

try {
    $mavenHomeHash = (
        $hashAlgorithm.ComputeHash($distributionUrlBytes) |
        ForEach-Object {
            $_.ToString("x2")
        }
    ) -join ''
} finally {
    $hashAlgorithm.Dispose()
}

$mavenHome = Join-Path `
    $mavenHomeParent `
    $mavenHomeHash

$mavenExecutable = Join-Path `
    $mavenHome `
    "bin\$mavenCommand"

if (
    (Test-Path -LiteralPath $mavenHome -PathType Container) -and
    (Test-Path -LiteralPath $mavenExecutable -PathType Leaf)
) {
    Write-Verbose "Maven encontrado em $mavenHome"
    Write-Output "MVN_CMD=$mavenExecutable"
    exit 0
}

New-Item `
    -Path $mavenHomeParent `
    -ItemType Directory `
    -Force |
    Out-Null

$temporaryFile = New-TemporaryFile
$temporaryDirectoryPath = "$($temporaryFile.FullName).dir"

Remove-Item `
    -LiteralPath $temporaryFile.FullName `
    -Force

$temporaryDirectory = New-Item `
    -Path $temporaryDirectoryPath `
    -ItemType Directory `
    -Force

$downloadPath = Join-Path `
    $temporaryDirectory.FullName `
    $distributionFileName

try {
    Write-Host "Baixando o Maven..."
    Write-Verbose "URL: $distributionUrl"
    Write-Verbose "Destino: $downloadPath"

    [Net.ServicePointManager]::SecurityProtocol = `
        [Net.SecurityProtocolType]::Tls12

    $webClient = New-Object System.Net.WebClient

    try {
        if ($env:MVNW_USERNAME -and $env:MVNW_PASSWORD) {
            $webClient.Credentials = New-Object `
                System.Net.NetworkCredential(
                    $env:MVNW_USERNAME,
                    $env:MVNW_PASSWORD
                )
        }

        $webClient.DownloadFile(
            $distributionUrl,
            $downloadPath
        )
    } finally {
        $webClient.Dispose()
    }

    $expectedChecksum = $wrapperProperties.distributionSha256Sum

    if (-not [string]::IsNullOrWhiteSpace($expectedChecksum)) {
        $actualChecksum = (
            Get-FileHash `
                -LiteralPath $downloadPath `
                -Algorithm SHA256
        ).Hash.ToLowerInvariant()

        if (
            $actualChecksum -ne
            $expectedChecksum.ToLowerInvariant()
        ) {
            Write-Error (
                "O checksum do Maven não corresponde ao valor esperado. " +
                "O arquivo baixado pode estar corrompido."
            )
        }
    }

    Expand-Archive `
        -LiteralPath $downloadPath `
        -DestinationPath $temporaryDirectory.FullName `
        -Force

    $actualDistributionDirectory = $null

    $expectedDirectory = Join-Path `
        $temporaryDirectory.FullName `
        $distributionDirectoryName

    $expectedExecutable = Join-Path `
        $expectedDirectory `
        "bin\$mavenCommand"

    if (
        (Test-Path -LiteralPath $expectedDirectory -PathType Container) -and
        (Test-Path -LiteralPath $expectedExecutable -PathType Leaf)
    ) {
        $actualDistributionDirectory = $expectedDirectory
    }

    if (-not $actualDistributionDirectory) {
        $candidateDirectories = Get-ChildItem `
            -LiteralPath $temporaryDirectory.FullName `
            -Directory

        foreach ($candidate in $candidateDirectories) {
            $candidateExecutable = Join-Path `
                $candidate.FullName `
                "bin\$mavenCommand"

            if (
                Test-Path `
                    -LiteralPath $candidateExecutable `
                    -PathType Leaf
            ) {
                $actualDistributionDirectory = $candidate.FullName
                break
            }
        }
    }

    if (-not $actualDistributionDirectory) {
        Write-Error (
            "Não foi possível encontrar o executável do Maven " +
            "dentro do arquivo baixado."
        )
    }

    if (Test-Path -LiteralPath $mavenHome) {
        Remove-Item `
            -LiteralPath $mavenHome `
            -Recurse `
            -Force
    }

    Move-Item `
        -LiteralPath $actualDistributionDirectory `
        -Destination $mavenHome

    if (-not (Test-Path -LiteralPath $mavenExecutable)) {
        Write-Error (
            "O Maven foi extraído, mas o executável não foi encontrado em: " +
            $mavenExecutable
        )
    }
} finally {
    if (Test-Path -LiteralPath $temporaryDirectory.FullName) {
        Remove-Item `
            -LiteralPath $temporaryDirectory.FullName `
            -Recurse `
            -Force `
            -ErrorAction SilentlyContinue
    }
}

Write-Output "MVN_CMD=$mavenExecutable"