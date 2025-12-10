package com.se182393.baidautien.mapper;


import com.se182393.baidautien.dto.request.GameCreationRequest;
import com.se182393.baidautien.dto.request.GameUpdateRequest;
import com.se182393.baidautien.dto.response.GameResponse;
import com.se182393.baidautien.entity.Game;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface GameMapper {

    @Mapping(target = "categories", ignore = true)
    Game toGame(GameCreationRequest request);

    GameResponse toGameResponse(Game game);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateGame(@MappingTarget Game game, GameUpdateRequest request);
}
