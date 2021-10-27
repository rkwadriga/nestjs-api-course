import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";

/**
 * This class will have the same properties like CreateEventDto, but all of them will be optional
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {
    
}