package com.se182393.baidautien.repository;

import com.se182393.baidautien.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PermissionRepository extends JpaRepository<Permission,String> {
}
