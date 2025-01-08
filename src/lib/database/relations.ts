import { relations } from "drizzle-orm/relations";
import { group, employee, schedule, shift, team } from "@lib/database/schema";

export const employeeRelations = relations(employee, ({ one, many }) => ({
  team: one(team, {
    fields: [employee.teamId],
    references: [team.id],
  }),
  group: one(group, {
    fields: [employee.groupId],
    references: [group.id],
  }),
  schedules: many(schedule),
}));

export const groupRelations = relations(group, ({ one, many }) => ({
  team: one(team, {
    fields: [group.teamId],
    references: [team.id],
  }),
  employees: many(employee),
}));

export const teamRelations = relations(team, ({ many }) => ({
  groups: many(group),
  employees: many(employee),
}));

export const scheduleRelations = relations(schedule, ({ one }) => ({
  employee: one(employee, {
    fields: [schedule.employeeId],
    references: [employee.id],
  }),
  shift: one(shift, {
    fields: [schedule.shiftId],
    references: [shift.id],
  }),
}));

export const shiftRelations = relations(shift, ({ many }) => ({
  schedules: many(schedule),
}));
