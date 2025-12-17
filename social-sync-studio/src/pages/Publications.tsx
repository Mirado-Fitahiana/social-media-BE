import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Loader2, Trash2, Edit, Image, Video } from 'lucide-react';
import { toast } from 'sonner';
import { postApi, Post } from '@/lib/api';
import { BASE_URL } from '@/constante';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Publications = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postApi.getAll();
      setPosts(data);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      toast.error('Erreur lors du chargement des publications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?');
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await postApi.delete(id);
      toast.success('Publication supprimée avec succès');
      setPosts(posts.filter(post => post.id !== id));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMediaIcon = (pathFile: string | null) => {
    if (!pathFile) return null;
    
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(pathFile);
    const isVideo = /\.(mp4|mov|avi|wmv|webm)$/i.test(pathFile);
    
    if (isImage) return <Image className="h-4 w-4 text-muted-foreground" />;
    if (isVideo) return <Video className="h-4 w-4 text-muted-foreground" />;
    return null;
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucune publication</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première publication
              </p>
              <Link to="/publications/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une publication
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-card hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        {getMediaIcon(post.pathFile)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.platform && (
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={deletingId === post.id}>
                          {deletingId === post.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/publications/edit/${post.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(post.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{formatTime(post.createdAt)}</span>
                      {post.username && <span>par {post.username}</span>}
                    </div>
                    <Badge variant="default">Publié</Badge>
                  </div>
                  {post.pathFile && (
                    <div className="mt-4">
                      {post.pathFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img 
                          src={`${BASE_URL}${post.pathFile}`} 
                          alt={post.title}
                          className="rounded-lg max-h-48 object-cover"
                        />
                      ) : (
                        <video 
                          src={`${BASE_URL}${post.pathFile}`}
                          controls
                          className="rounded-lg max-h-48"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Publications;
