package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.entity.Role;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.repo.RoleRepo;
import com.mecinema.mecinema.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepo roleRepo;

    @Override
    public Role findByName(RoleUser name) {
        return roleRepo.findByName(name);
    }
}
