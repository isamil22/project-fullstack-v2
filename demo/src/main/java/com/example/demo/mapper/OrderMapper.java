package com.example.demo.mapper;

import com.example.demo.dto.OrderDTO;
import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.Order;
import com.example.demo.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

// We still recommend using the UserReferenceMapper you created in the previous step
@Mapper(componentModel = "spring", uses = { UserReferenceMapper.class })
public interface OrderMapper {

    // THIS IS THE FIX: Use a Java expression for the mapping to avoid ambiguity.
    @Mapping(target = "userId", expression = "java(order.getUser() != null ? order.getUser().getId() : null)")
    @Mapping(target = "orderItems", source = "items")
    OrderDTO toDTO(Order order);

    // This mapping relies on the UserReferenceMapper and should be correct.
    @Mapping(target = "user", source = "userId")
    @Mapping(target = "items", source = "orderItems")
    Order toEntity(OrderDTO orderDTO);

    List<OrderDTO> toDTOs(List<Order> orders);

    List<Order> toEntities(List<OrderDTO> orderDTOS);

    @Mapping(target = "productId", source = "product.id")
    OrderItemDTO toOrderItemDTO(OrderItem orderItem);

    @Mapping(target = "product.id", source = "productId")
    OrderItem toOrderItemEntity(OrderItemDTO orderItemDTO);

    List<OrderItemDTO> toOrderItemDTOs(List<OrderItem> orderItem);

    List<OrderItem> toOrderItemEntities(List<OrderItemDTO> orderItemDTO);
}