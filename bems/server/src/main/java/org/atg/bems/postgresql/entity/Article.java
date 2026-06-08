package org.atg.bems.postgresql.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 관리자 게시판을 위한 간단한 엔티티
 */

@Getter
@Entity
@ToString(callSuper = true)
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Table(name = "article")
@SequenceGenerator(name = "article_generator", sequenceName = "article_seq", initialValue = 1, allocationSize = 1)
public class Article extends AuditingField{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "article_generator")
    private Long id;

    @Column(name = "title", nullable = false, length = 50)
    String title;

    @Column(name = "content", nullable = false)
    String content;
}
