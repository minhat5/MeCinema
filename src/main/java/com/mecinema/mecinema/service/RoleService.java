package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Role;
import com.mecinema.mecinema.model.enumtype.RoleUser;

public interface RoleService {
    Role findByName(RoleUser name);
}
