import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Calendar, Share2, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Publications cette semaine',
      value: '12',
      icon: FileText,
      trend: '+8%',
      color: 'text-primary'
    },
    {
      title: 'Publications ce mois-ci',
      value: '48',
      icon: Calendar,
      trend: '+12%',
      color: 'text-accent'
    },
    {
      title: 'Réseaux connectés',
      value: '5',
      icon: Share2,
      color: 'text-info'
    },
    {
      title: 'Publications planifiées',
      value: '23',
      icon: TrendingUp,
      color: 'text-success'
    }
  ];

  const weeklyData = [
    { day: 'Lun', posts: 4 },
    { day: 'Mar', posts: 3 },
    { day: 'Mer', posts: 6 },
    { day: 'Jeu', posts: 5 },
    { day: 'Ven', posts: 7 },
    { day: 'Sam', posts: 2 },
    { day: 'Dim', posts: 1 }
  ];

  const socialData = [
    { name: 'Facebook', value: 30, color: '#3b5998' },
    { name: 'Instagram', value: 25, color: '#E4405F' },
    { name: 'LinkedIn', value: 20, color: '#0077B5' },
    { name: 'X (Twitter)', value: 15, color: '#000000' },
    { name: 'TikTok', value: 10, color: '#000000' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de votre activité sur les réseaux sociaux
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.trend && (
                  <p className="text-xs text-accent mt-1">
                    {stat.trend} par rapport à la semaine dernière
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Posts Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Publications par jour</CardTitle>
              <CardDescription>Activité des 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Social Networks Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Résultats par réseau social</CardTitle>
              <CardDescription>Répartition de vos publications</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={socialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {socialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Vos dernières publications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Publication sur Facebook et Instagram</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Publié il y a {index + 1} heure{index > 0 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-xs text-success">Publié</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
