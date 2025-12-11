package com.se182393.baidautien.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.se182393.baidautien.dto.request.ApiResponse;
import com.se182393.baidautien.dto.request.RoleRequest;
import com.se182393.baidautien.dto.response.RoleResponse;
import com.se182393.baidautien.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
   RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }


    @GetMapping
    ApiResponse<List<RoleResponse>> findAll(){
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }


    @DeleteMapping("/{role}")
    ApiResponse<Void> delete(@PathVariable String role){
        roleService.delete(role);
        return ApiResponse.<Void>builder()
                .build();
    }
}
