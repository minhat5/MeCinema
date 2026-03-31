package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Role;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
    Role findByName(RoleUser name);
}
