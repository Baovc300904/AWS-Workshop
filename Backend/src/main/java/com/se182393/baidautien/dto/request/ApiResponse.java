package com.se182393.baidautien.dto.request;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)//cai nay se khong de response ra may cai null ko can thiet
//cai nay goi la nomalize Api response
public class ApiResponse <T> {
     @Builder.Default
     int code = 1000;
     String message;
     T result;
}
