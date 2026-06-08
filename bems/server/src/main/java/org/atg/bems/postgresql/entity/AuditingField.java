package org.atg.bems.postgresql.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

/**
 * 데이터들에 대한 공통적인 메타 데이터를 제공해주기 위한 부모 엔티티
 */

@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class AuditingField {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @CreatedDate
    @Column(name = "created_at", nullable = true)
    protected LocalDateTime createdAt;

    //TODO : spring security가 구축되면 nullable = false 로 바꿔줘야 함.
    @CreatedBy
    @Column(name = "created_by", length = 100, nullable = true, updatable = false)
    protected String createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @LastModifiedDate
    @Column(name = "updated_at", nullable = true)
    protected  LocalDateTime updatedAt;

    //TODO : spring security가 구축되면 nullable = false 로 바꿔줘야 함.
    @LastModifiedBy
    @Column(name = "updated_by", length = 100, nullable = true)
    protected String updatedBy;

}
