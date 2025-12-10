import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical } from 'lucide-react';

const Publications = () => {
  const posts = [
    {
      id: 1,
      content: 'Nouvelle fonctionnalité disponible ! 🎉',
      date: '2025-12-01',
      time: '14:30',
      networks: ['Facebook', 'Instagram', 'LinkedIn'],
      status: 'published'
    },
    {
      id: 2,
      content: 'N\'oubliez pas notre webinaire de demain',
      date: '2025-12-02',
      time: '10:00',
      networks: ['LinkedIn', 'Twitter'],
      status: 'scheduled'
    },
    {
      id: 3,
      content: 'Découvrez nos conseils pour améliorer votre engagement',
      date: '2025-11-30',
      time: '16:00',
      networks: ['Facebook', 'Instagram'],
      status: 'published'
    },
    {
      id: 4,
      content: 'Nouvelle vidéo tutoriel disponible sur notre chaîne',
      date: '2025-12-03',
      time: '18:00',
      networks: ['TikTok', 'Instagram'],
      status: 'draft'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      published: { label: 'Publié', variant: 'default' as const },
      scheduled: { label: 'Planifié', variant: 'secondary' as const },
      draft: { label: 'Brouillon', variant: 'outline' as const }
    };
    const { label, variant } = variants[status as keyof typeof variants];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Publications</h1>
            <p className="text-muted-foreground">
              Gérez toutes vos publications
            </p>
          </div>
          <Link to="/publications/new">
            <Button className="shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle publication
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-card hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{post.content}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.networks.map((network) => (
                        <Badge key={network} variant="outline" className="text-xs">
                          {network}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.time}</span>
                  </div>
                  {getStatusBadge(post.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Publications;
