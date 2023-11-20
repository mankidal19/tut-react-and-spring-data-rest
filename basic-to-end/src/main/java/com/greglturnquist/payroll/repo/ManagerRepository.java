package com.greglturnquist.payroll.repo;

import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.greglturnquist.payroll.model.Manager;

// Instead of extending the usual CrudRepository, 
// you do not need so many methods. Instead, you need 
// to save data (which is also used for updates), 
// and you need to look up existing users. 
// Hence, you can use Spring Data Common’s minimal Repository marker interface. 
// It comes with no predefined operations.

// Spring Data REST, by default, will export any repository it finds. 
// You do NOT want this repository exposed for REST operations! 
// Apply the @RepositoryRestResource(exported = false) annotation to block it from export. 
//This prevents the repository and its metadata from being served up.
@RepositoryRestResource(exported = false)
public interface ManagerRepository extends Repository<Manager, Long> {
    
    Manager save(Manager manager);
    Manager findByName(String name);
}
