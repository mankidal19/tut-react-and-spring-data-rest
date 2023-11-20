package com.greglturnquist.payroll.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.greglturnquist.payroll.model.Manager;
import com.greglturnquist.payroll.repo.ManagerRepository;

@Component
public class SpringJpaUserDetailsService implements UserDetailsService {

    private final ManagerRepository managerRepository;

    @Autowired
    public SpringJpaUserDetailsService(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Manager manager = this.managerRepository.findByName(username);
        return new User(manager.getName(), manager.getPassword(), AuthorityUtils.createAuthorityList(manager.getRoles()));
    }
    
}
