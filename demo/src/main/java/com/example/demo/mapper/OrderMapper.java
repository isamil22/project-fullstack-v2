package com.example.demo.mapper;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import com.example.demo.model.User;
import com.example.demo.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring")
public abstract class OrderMapper {

    @Autowired
    private UserRepository userRepository;

    public User map(Long value) {
        if (value == null) {
            return null;
        }
        return userRepository.getReferenceById(value);
    }

    @Mapping(target = "userId", expression = "java(order.getUser() != null ? order.getUser().getId() : null)")
    @Mapping(target = "orderItems", source = "items")
    public abstract OrderDTO toDTO(Order order);

    @Mapping(target = "user", source = "userId")
    @Mapping(target = "items", source = "orderItems")
    public abstract Order toEntity(OrderDTO orderDTO);

    public abstract List<OrderDTO> toDTOs(List<Order> orders);

    public abstract List<Order> toEntities(List<OrderDTO> orderDTOS);

    @Mapping(target = "productId", source = "product.id")
    public abstract OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    @Mapping(target = "product.id", source = "productId")
    @Mapping(target = "order", ignore = true)
    public abstract OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);

    public abstract List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> orderItems);

    public abstract List<OrderItem> toOrderItemEntities(List<OrderItemDTO> orderItemDTOs);
}