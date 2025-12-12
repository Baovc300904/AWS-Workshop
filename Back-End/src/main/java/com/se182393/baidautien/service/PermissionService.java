package com.se182393.baidautien.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.se182393.baidautien.dto.request.PermissionRequest;
import com.se182393.baidautien.dto.response.PermissionResponse;
import com.se182393.baidautien.entity.Permission;
import com.se182393.baidautien.mapper.PermissionMapper;
import com.se182393.baidautien.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)
public class PermissionService {

    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @SuppressWarnings("null")
    public  PermissionResponse create(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);

        permission = permissionRepository.save(permission);

        return permissionMapper.toPermissionResponse(permission);
    }

    //stream giong builder ,stream chủ íu xài với th mapper
    public   List<PermissionResponse> getAll(){
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).collect(Collectors.toList());
    }

   public void delete(String permission){
        if (permission != null) {
            permissionRepository.deleteById(permission);
        }
    }
}
