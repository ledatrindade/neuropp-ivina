CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE app_users (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    token_version INTEGER NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_app_users_role CHECK (role IN ('ADMIN', 'RESPONSIBLE'))
);

CREATE UNIQUE INDEX ux_app_users_email_lower ON app_users (LOWER(email));

CREATE TABLE children (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    age INTEGER NOT NULL,
    responsible_id UUID NOT NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_children_age CHECK (age BETWEEN 0 AND 17),
    CONSTRAINT fk_children_responsible
        FOREIGN KEY (responsible_id) REFERENCES app_users(id) ON DELETE RESTRICT
);

CREATE INDEX ix_children_responsible ON children (responsible_id);

CREATE TABLE availability_slots (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_availability_slot_time CHECK (end_time > start_time)
);

CREATE INDEX ix_availability_slots_date ON availability_slots (date);

-- Impede intervalos sobrepostos no mesmo dia. O intervalo [) permite que
-- 09:00-10:00 e 10:00-11:00 sejam vizinhos sem conflito.
ALTER TABLE availability_slots
    ADD CONSTRAINT ex_availability_slots_no_overlap
    EXCLUDE USING gist (
        date WITH =,
        (tsrange(date + start_time, date + end_time, '[)')) WITH &&
    )
    WHERE (deleted_at IS NULL);

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    responsible_id UUID NOT NULL,
    child_id UUID NOT NULL,
    slot_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL,
    notes TEXT,
    hidden_for_responsible BOOLEAN NOT NULL DEFAULT FALSE,
    hidden_for_admin BOOLEAN NOT NULL DEFAULT FALSE,
    cancelled_at TIMESTAMPTZ,
    rescheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_appointments_status CHECK (
        status IN ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'ATTENDED', 'MISSED', 'COMPLETED')
    ),
    CONSTRAINT fk_appointments_responsible
        FOREIGN KEY (responsible_id) REFERENCES app_users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_child
        FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE RESTRICT,
    CONSTRAINT fk_appointments_slot
        FOREIGN KEY (slot_id) REFERENCES availability_slots(id) ON DELETE RESTRICT
);

CREATE INDEX ix_appointments_responsible ON appointments (responsible_id, created_at DESC);
CREATE INDEX ix_appointments_child ON appointments (child_id);
CREATE INDEX ix_appointments_slot ON appointments (slot_id);

-- Permite preservar agendamentos cancelados no histórico e reutilizar o horário,
-- mas impede dois agendamentos ativos no mesmo slot.
CREATE UNIQUE INDEX ux_appointments_active_slot
    ON appointments (slot_id)
    WHERE status <> 'CANCELLED';

CREATE TABLE attendance_documents (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL,
    title VARCHAR(180) NOT NULL,
    document_type VARCHAR(40) NOT NULL,
    content TEXT,
    file_url VARCHAR(2048),
    is_released BOOLEAN NOT NULL DEFAULT FALSE,
    released_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_attendance_documents_type CHECK (
        document_type IN ('EVALUATION', 'SESSION', 'DEVOLUTION', 'GUIDANCE')
    ),
    CONSTRAINT ck_attendance_documents_content CHECK (
        content IS NOT NULL OR file_url IS NOT NULL
    ),
    CONSTRAINT fk_attendance_documents_appointment
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT
);

CREATE INDEX ix_attendance_documents_appointment
    ON attendance_documents (appointment_id, created_at DESC);
