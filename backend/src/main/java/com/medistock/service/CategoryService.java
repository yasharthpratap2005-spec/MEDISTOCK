package com.medistock.service;

import com.medistock.dto.CategoryRequest;
import com.medistock.dto.CategoryResponse;
import com.medistock.entity.Category;
import com.medistock.exception.BusinessException;
import com.medistock.exception.ResourceNotFoundException;
import com.medistock.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BusinessException("Category with name '" + request.getName() + "' already exists", "DUPLICATE_CATEGORY");
        }
        Category category = Category.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .active(true)
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = findById(id);
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(request.getName(), id)) {
            throw new BusinessException("Category with name '" + request.getName() + "' already exists", "DUPLICATE_CATEGORY");
        }
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse toggleStatus(Long id) {
        Category category = findById(id);
        category.setActive(!category.getActive());
        return toResponse(categoryRepository.save(category));
    }

    private Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.getActive())
                .build();
    }
}
