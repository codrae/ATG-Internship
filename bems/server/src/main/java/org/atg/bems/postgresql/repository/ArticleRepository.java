package org.atg.bems.postgresql.repository;

import org.atg.bems.postgresql.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findTop5ByOrderByCreatedAtDesc();
}
