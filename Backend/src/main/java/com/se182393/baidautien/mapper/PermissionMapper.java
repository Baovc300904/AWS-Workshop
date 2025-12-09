package com.se182393.baidautien.mapper;

import com.se182393.baidautien.dto.request.PermissionRequest;
import com.se182393.baidautien.dto.response.PermissionResponse;
import com.se182393.baidautien.entity.Permission;
import org.mapstruct.Mapper;

//xai mapper trong spring
@Mapper(componentModel = "spring")
public interface PermissionMapper {



    Permission toPermission(PermissionRequest request);


    PermissionResponse toPermissionResponse(Permission permission);
}