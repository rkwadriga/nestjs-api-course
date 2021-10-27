import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateEventDto } from "./create-event.dto";
import { UpdateEventDto } from "./update.event.dto";


@Controller('/events')
export class EventsController {

    @Get()
    findAll() {
        return [
            {id: 1, name: "Event 1"},
            {id: 2, name: "Event 2"},
            {id: 3, name: "Event 3"}
        ];
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return {id, name: "Event " + id};
    }

    @Post()
    create(@Body() input: CreateEventDto) {
        return input;
    }

    @Patch(':id')
    update(@Param('id') id, @Body() input: UpdateEventDto) {
        return input;
    }

    @Delete(':id')
    @HttpCode(204) // No content
    remove(@Param('id') id) {}

}