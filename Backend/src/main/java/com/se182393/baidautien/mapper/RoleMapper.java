package com.se182393.baidautien.mapper;
import com.se182393.baidautien.dto.request.RoleRequest;
import com.se182393.baidautien.dto.response.RoleResponse;
import com.se182393.baidautien.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


//xai mapper trong spring
@Mapper(componentModel = "spring", uses = PermissionMapper.class)
public interface RoleMapper {
    //lí dó phải có cái Mapping vì cái  Rolerequest không có field permission như class entity Role, cái permission sẽ tự xử lí riêng
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
