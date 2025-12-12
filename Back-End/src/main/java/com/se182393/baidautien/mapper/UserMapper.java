package com.se182393.baidautien.mapper;

import com.se182393.baidautien.dto.request.UserCreationRequest;
import com.se182393.baidautien.dto.request.UserUpdateRequest;
import com.se182393.baidautien.dto.response.UserResponse;
import com.se182393.baidautien.entity.User;
import org.mapstruct.*;


@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface UserMapper {




    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "balance", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
