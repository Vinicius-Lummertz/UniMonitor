import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import type { Activity, PriorityLevel } from '../types/database';
import { useActivitiesStore } from '../store/activitiesStore';
import { EventDetailsModal } from '../components/modals/EventDetailsModal';
import { AddActivityModal } from '../components/modals/AddActivityModal';

const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
});

const formats = {
    dateFormat: 'dd',
    dayFormat: (date: Date, culture: any, localizer: any) =>
        localizer.format(date, 'EEEE', culture),
    dayRangeHeaderFormat: ({ start, end }: any, culture: any, localizer: any) =>
        `${localizer.format(start, 'dd MMM', culture)} - ${localizer.format(end, 'dd MMM', culture)}`,
    timeGutterFormat: 'HH:mm',
    agendaTimeFormat: 'HH:mm',
    agendaDateFormat: 'EEE, dd/MM',
    eventTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
        `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
};

const priorityColors: Record<PriorityLevel, string> = {
    baixa: '#10B981',   // green
    media: '#F59E0B',   // amber
    alta: '#F97316',    // orange
    urgente: '#EF4444', // red
};

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Activity;
}

export const CalendarPage: React.FC = () => {
    // Default to 'month' view
    const [view, setView] = useState<Views>('month');
    const [date, setDate] = useState(new Date());
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Details Modal State
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const { activities, fetchActivities, toggleComplete } = useActivitiesStore();

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const events: CalendarEvent[] = activities.map((activity) => {
        const startDate = new Date(activity.due_date);
        // End date is 1 hour after start by default for visualization
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        return {
            id: activity.id,
            title: activity.title,
            start: startDate,
            end: endDate,
            resource: activity,
        };
    });

    const eventStyleGetter = (event: CalendarEvent) => {
        const priority = event.resource.priority;
        const backgroundColor = priorityColors[priority];

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: event.resource.completed ? 0.6 : 1,
                color: 'white',
                border: '0px',
                display: 'block',
                fontWeight: '500',
                fontSize: '0.8rem',
                textDecoration: event.resource.completed ? 'line-through' : 'none',
                padding: '2px 4px',
            },
        };
    };

    const handleSelectSlot = (slotInfo: { start: Date; action: string }) => {
        // If clicking (selecting) a day, set date and open modal
        setSelectedDate(slotInfo.start);

        // If in month view and single click, maybe drilldown? 
        // RBG handles drilldown automatically if not overridden.
        // Let's just open Add Modal on slot selection (empty space)
        setIsAddModalOpen(true);
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedActivity(event.resource);
        setIsDetailsModalOpen(true);
    };

    const CustomToolbar = ({ label, onNavigate }: any) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 px-2">
            <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <button onClick={() => onNavigate('PREV')} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => onNavigate('NEXT')} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <button onClick={() => onNavigate('TODAY')} className="sm:hidden px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-medium">
                    Hoje
                </button>
            </div>

            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 capitalize text-center sm:text-left">
                {label}
            </h2>

            <button
                onClick={() => onNavigate('TODAY')}
                className="hidden sm:block px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-medium transition-colors"
            >
                Hoje
            </button>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-neutral-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-theme-500 to-theme-600 text-white p-4 sm:p-6 shadow-colored">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-display font-bold">Calendário</h1>
                        <p className="text-theme-100 text-xs sm:text-sm">Suas atividades e prazos</p>
                    </div>
                </div>

                {/* Priority Legend - Scrollable on mobile */}
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 custom-scrollbar">
                    {Object.entries(priorityColors).map(([priority, color]) => (
                        <div key={priority} className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-[10px] sm:text-xs font-medium capitalize">{priority}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Switcher */}
            <div className="flex gap-2 p-3 bg-white border-b border-neutral-200 overflow-x-auto">
                {(['month', 'agenda'] as Views[]).map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`
                          flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium transition-all text-center whitespace-nowrap
                          ${view === v
                                ? 'bg-theme-100 text-theme-900'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}
                        `}
                    >
                        {v === 'month' ? 'Mês' : 'Lista'}
                    </button>
                ))}
            </div>

            {/* Calendar */}
            <div className="flex-1 p-2 sm:p-4 overflow-hidden flex flex-col">
                <div className="bg-white rounded-2xl shadow-soft p-2 sm:p-4 flex-1 relative overflow-auto">
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        view={view}
                        onView={setView}
                        date={date}
                        onNavigate={setDate}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        components={{ toolbar: CustomToolbar }}
                        formats={formats}
                        culture="pt-BR"
                        messages={{
                            next: 'Próximo',
                            previous: 'Anterior',
                            today: 'Hoje',
                            month: 'Mês',
                            week: 'Semana',
                            day: 'Dia',
                            agenda: 'Lista',
                            date: 'Data',
                            time: 'Hora',
                            event: 'Evento',
                            noEventsInRange: 'Nenhuma atividade neste período.',
                            showMore: (total) => `+${total}`,
                        }}
                        style={{ height: '100%', minHeight: '400px' }}
                    />
                </div>
            </div>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setSelectedDate(new Date());
                    setIsAddModalOpen(true);
                }}
                className="
                  fixed bottom-24 right-5
                  w-14 h-14 rounded-full
                  bg-gradient-to-r from-theme-500 to-theme-600
                  text-white shadow-colored
                  flex items-center justify-center
                  z-30
                "
            >
                <Plus size={24} />
            </motion.button>

            {/* Add Activity Modal */}
            <AddActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                selectedDate={selectedDate}
            />

            {/* Event Details Modal */}
            {selectedActivity && (
                <EventDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedActivity(null);
                    }}
                    activity={selectedActivity}
                />
            )}
        </div>
    );
};
