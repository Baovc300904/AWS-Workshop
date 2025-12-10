package com.se182393.baidautien.mapper;

import com.se182393.baidautien.dto.request.UserCreationRequest;
import com.se182393.baidautien.dto.request.UserUpdateRequest;
import com.se182393.baidautien.dto.response.UserResponse;
import com.se182393.baidautien.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {

    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);


    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
