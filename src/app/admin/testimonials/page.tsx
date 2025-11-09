'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAdminTranslations } from '@/hooks/use-admin-translations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Testimonial {
  id: string;
  name: string;
  company?: string;
  role?: string;
  content: string;
  rating: number;
  isActive: boolean;
  order: number;
}

export default function TestimonialsManagement() {
  const { t } = useAdminTranslations();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    order: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTestimonial 
        ? `/api/testimonials/${editingTestimonial.id}`
        : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchTestimonials();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      company: testimonial.company || '',
      role: testimonial.role || '',
      content: testimonial.content,
      rating: testimonial.rating,
      order: testimonial.order
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTestimonialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return;

    setIsDeleting(testimonialToDelete);
    try {
      const response = await fetch(`/api/testimonials/${testimonialToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success(t.deleteSuccess);
        await fetchTestimonials();
        setDeleteDialogOpen(false);
        setTestimonialToDelete(null);
      } else {
        throw new Error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error(t.deleteError);
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      role: '',
      content: '',
      rating: 5,
      order: 0
    });
    setEditingTestimonial(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.deleting}
                </>
              ) : (
                t.delete
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.testimonials}</h1>
          <p className="text-slate-600 dark:text-slate-400">{t.testimonials} Management</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              {t.add} {t.testimonials}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? `${t.edit} ${t.testimonials}` : `${t.add} ${t.testimonials}`}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial ? t.update : t.create} {t.testimonials.toLowerCase()}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">{t.company}</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">{t.role}</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="content">{t.content}</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">{t.rating}</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>{rating} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="order">{t.order}</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  {t.cancel}
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingTestimonial ? t.updating : t.creating}
                    </>
                  ) : (
                    `${editingTestimonial ? t.update : t.create} ${t.testimonials}`
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : testimonials.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">{t.noData}</h3>
                <p className="text-slate-600 dark:text-slate-400">{t.add} {t.testimonials.toLowerCase()} to get started.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                    <MessageSquare className="w-5 h-5" />
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    {testimonial.role && `${testimonial.role}`}
                    {testimonial.role && testimonial.company && ' at '}
                    {testimonial.company && `${testimonial.company}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex">
                    {renderStars(testimonial.rating)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(testimonial.id)}
                    disabled={isDeleting === testimonial.id}
                  >
                    {isDeleting === testimonial.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 italic">"{testimonial.content}"</p>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}