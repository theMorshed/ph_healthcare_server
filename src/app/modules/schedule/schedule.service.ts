import { addHours, addMinutes, format } from 'date-fns';
import { prisma } from '../../../shared/prisma';
import { TSchedule } from './schedule.types';
import { Schedule } from '@prisma/client';

export const createScheduleService = async(payload: TSchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;
    const firstDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const intervalTime = 30;
    const schedules = [];

    while (firstDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(firstDate, 'yyyy-MM-dd')}`, 
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])                
            )
        )   

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(firstDate, 'yyyy-MM-dd')}`, 
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])                
            )
        ) 
        
        while (startDateTime < endDateTime) {
            const scheduleData = {
                startDateTime: startDateTime,
                endDateTime: addMinutes(startDateTime, intervalTime)
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
        }

        firstDate.setDate(firstDate.getDate() + 1);
    }

    return schedules;
}