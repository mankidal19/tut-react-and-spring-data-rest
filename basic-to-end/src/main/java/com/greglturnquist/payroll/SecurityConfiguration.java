package com.greglturnquist.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.greglturnquist.payroll.model.Manager;

@Configuration
@EnableWebSecurity // tells Spring Boot to drop its autoconfigured security policy and use this one instead. For quick demos, autoconfigured security is okay. But for anything real, you should write the policy yourself.
@EnableGlobalMethodSecurity(prePostEnabled = true) // turns on method-level security with Spring Security’s sophisticated @Pre and @Post annotations.
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    
    @Autowired
    private SpringJpaUserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(Manager.PASSWORD_ENCODER);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            // granted unconditional access for static resources
            .antMatchers("/built/**", "/main.css").permitAll()
            // anything else will require authentication
            .anyRequest().authenticated()
                .and().formLogin() // requires login via form
                .defaultSuccessUrl("/", true)
                .permitAll()
            .and()
            .httpBasic().and().csrf().disable() // BASIC login is also configured with CSRF disabled. This is mostly for demonstrations and not recommended for production systems without careful analysis.
            .logout().logoutSuccessUrl("/");

        
    }
}
