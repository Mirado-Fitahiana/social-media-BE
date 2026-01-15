import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Publication {
  id: number;
  content: string;
  date: string;
  time: string;
  networks: string[];
  status: 'published' | 'scheduled' | 'draft';
}

const Calendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock publications data
  const publications: Publication[] = [
    {
      id: 1,
      content: 'Nouvelle fonctionnalité disponible ! 🎉',
      date: '2025-12-01',
      time: '14:30',
      networks: ['Facebook', 'Instagram'],
      status: 'published'
    },
    {
      id: 2,
      content: 'N\'oubliez pas notre webinaire de demain',
      date: '2025-12-05',
      time: '10:00',
      networks: ['LinkedIn'],
      status: 'scheduled'
    },
    {
      id: 3,
      content: 'Conseils pour améliorer votre engagement',
      date: '2025-11-28',
      time: '16:00',
      networks: ['Facebook', 'Instagram'],
      status: 'published'
    },
    {
      id: 4,
      content: 'Nouveau tutoriel vidéo disponible',
      date: '2025-12-10',
      time: '18:00',
      networks: ['TikTok', 'Instagram'],
      status: 'scheduled'
    },
    {
      id: 5,
      content: 'Offre spéciale weekend',
      date: '2025-12-15',
      time: '09:00',
      networks: ['Facebook', 'Instagram', 'Twitter'],
      status: 'scheduled'
    },
    {
      id: 6,
      content: 'Récap de la semaine',
      date: '2025-11-30',
      time: '17:00',
      networks: ['LinkedIn'],
      status: 'published'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = monthStart.getDay();
  // Adjust for Monday start (1 = Monday, 0 = Sunday becomes 7)
  const startPadding = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getPublicationsForDate = (date: Date) => {
    return publications.filter(pub => 
      isSameDay(parseISO(pub.date), date)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNewPost = (date?: Date) => {
    // Navigate to new post page with date pre-selected
    navigate('/publications/new', { state: { selectedDate: date } });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'bg-success',
      scheduled: 'bg-info',
      draft: 'bg-muted-foreground'
    };
    return colors[status as keyof typeof colors];
  };

  const dayPublications = selectedDate ? getPublicationsForDate(selectedDate) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calendrier</h1>
            <p className="text-muted-foreground">
              Planifiez et visualisez vos publications
            </p>
          </div>
          <Button className="shadow-glow" onClick={() => handleNewPost()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle publication
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day Headers */}
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}

                  {/* Empty cells for padding */}
                  {Array.from({ length: startPadding }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}

                  {/* Calendar Days */}
                  {daysInMonth.map((day) => {
                    const dayPubs = getPublicationsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentDay = isToday(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDateClick(day)}
                        className={`
                          aspect-square p-2 rounded-lg border transition-smooth
                          hover:border-primary hover:shadow-md
                          ${isSelected ? 'border-primary bg-primary/5 shadow-glow' : 'border-border'}
                          ${isCurrentDay ? 'bg-accent/10' : ''}
                          ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
                        `}
                      >
                        <div className="flex flex-col h-full">
                          <span className={`text-sm font-medium ${isCurrentDay ? 'text-accent' : ''}`}>
                            {format(day, 'd')}
                          </span>
                          {dayPubs.length > 0 && (
                            <div className="flex-1 flex flex-col gap-1 mt-1">
                              {dayPubs.slice(0, 2).map((pub) => (
                                <div
                                  key={pub.id}
                                  className={`h-1 rounded-full ${getStatusColor(pub.status)}`}
                                />
                              ))}
                              {dayPubs.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{dayPubs.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-muted-foreground">Publié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-info" />
                    <span className="text-sm text-muted-foreground">Planifié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Brouillon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Day Details */}
          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate ? (
                    <>Publications du {format(selectedDate, 'dd MMMM', { locale: fr })}</>
                  ) : (
                    'Sélectionnez une date'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDate ? (
                  <>
                    {dayPublications.length > 0 ? (
                      <div className="space-y-3">
                        {dayPublications.map((pub) => (
                          <div key={pub.id} className="p-3 rounded-lg border bg-card hover:shadow-md transition-smooth">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-sm font-medium">{pub.time}</span>
                              <Badge variant={pub.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                                {pub.status === 'published' ? 'Publié' : pub.status === 'scheduled' ? 'Planifié' : 'Brouillon'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {pub.content}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {pub.networks.map((network) => (
                                <Badge key={network} variant="outline" className="text-xs">
                                  {network}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Aucune publication prévue ce jour
                        </p>
                        <Button onClick={() => handleNewPost(selectedDate)} size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Planifier une publication
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Cliquez sur une date pour voir les publications
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Publications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Prochaines publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publications
                .filter(pub => new Date(pub.date) >= new Date() && pub.status === 'scheduled')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-smooth">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{pub.content}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{format(parseISO(pub.date), 'dd MMMM yyyy', { locale: fr })}</span>
                        <span>{pub.time}</span>
                        <div className="flex gap-1">
                          {pub.networks.slice(0, 2).map((network) => (
                            <Badge key={network} variant="outline" className="text-xs">
                              {network}
                            </Badge>
                          ))}
                          {pub.networks.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{pub.networks.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
