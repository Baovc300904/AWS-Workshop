package com.se182393.baidautien.configuration;


import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.se182393.baidautien.entity.Role;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.repository.RoleRepository;
import com.se182393.baidautien.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Configuration
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor()
// cai nay se inject 1 constructor thi bean của cả dự án sẽ tự inject vào giùm mà k cần autowired
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    @Bean
    @SuppressWarnings("null")
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if (userRepository.findByUsername("ADMIN").isEmpty()) {
                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findById("ADMIN")
                        .orElseGet(() -> roleRepository.save(Role.builder()
                                .name("ADMIN")
                                .description("Administrator role")
                                .build()));
                roles.add(adminRole);

                User user = User.builder()
                        .username("ADMIN")
                        .password(passwordEncoder.encode("ADMIN"))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
        };
    }
}















// @Autowired
//    RoleRepository roleRepository;
//    @Autowired
//    PermissionRepository permissionRepository;
//    @Autowired
//    UserRepository userRepository;
//
//
//    @Bean
//    ApplicationRunner applicationRunner() {
//        return args -> {
//            createRole();
//            createUser();
//        };
//    }
//
//    private void createPermission() {
//        Permission permission = new Permission();
//        permission.setName("QUYEN_DUOC_SUA");
//        permissionRepository.save(permission);
//    }
//
//    private void createRole() {
//        createPermission();
//        Role role = new Role();
//        role.setName(com.se182393.baidautien.enums.Role.ADMIN.name());
//        Role role2 = new Role();
//        role2.setName(com.se182393.baidautien.enums.Role.USER.name());
//        Set<Permission> permissions = new HashSet<>();
//        Permission permissionnns = permissionRepository.findById("QUYEN_DUOC_SUA").orElse(null);
//        permissions.add(permissionnns);
//        role.setPermissions(permissions);
//        roleRepository.save(role);
//        role2.setPermissions(permissions);
//        roleRepository.save(role2);
//    }
//
//    private void createUser() {
//        if (userRepository.findByUsername("admin").isEmpty()) {
//            HashSet<Role> roleSet = new HashSet<>();
//            Role role = roleRepository.findById(com.se182393.baidautien.enums.Role.ADMIN.name()).orElse(null);
//            roleSet.add(role);
//            User user = User.builder()
//                    .username("admin")
//                    .password(passwordEncoder.encode("admin"))
//                    .roles(roleSet)
//                    .build();
//
//            userRepository.save(user);
//            log.warn("admin has beeen automatically created when running project");
//        }
//    }
//}
