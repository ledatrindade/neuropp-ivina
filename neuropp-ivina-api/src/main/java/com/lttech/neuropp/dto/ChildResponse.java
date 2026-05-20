package com.lttech.neuropp.dto;

import java.util.UUID;

import com.lttech.neuropp.entity.Child;

/*
 * DTO de saída da criança.
 */
public class ChildResponse {

    private UUID id;
    private String name;
    private Integer age;
    private UUID responsibleId;
    private String responsibleName;

    public static ChildResponse fromEntity(Child child) {
        ChildResponse response = new ChildResponse();

        response.setId(child.getId());
        response.setName(child.getName());
        response.setAge(child.getAge());
        response.setResponsibleId(child.getResponsible().getId());
        response.setResponsibleName(child.getResponsible().getName());

        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

   public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

   public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

   public UUID getResponsibleId() {
        return responsibleId;
    }

    public void setResponsibleId(UUID responsibleId) {
        this.responsibleId = responsibleId;
    }

   public String getResponsibleName() {
        return responsibleName;
    }

    public void setResponsibleName(String responsibleName) {
        this.responsibleName = responsibleName;
    }
}