package com.se182393.baidautien.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Set;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class Role {
    @Id
    String name;
    String description;

    // casi này để tạo mqh nhiều nhiều giữa role vs
    @ManyToMany
   
    Set<Permission> permissions;

    @PrePersist
    @PreUpdate
    private void normalize() {
        if (this.name != null) {
            this.name = this.name.toUpperCase();
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }
}
