'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Statistic {
  id: string;
  label: string;
  value: string;
  icon?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

const iconOptions = [
  { value: 'Building2', label: 'Building' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Users', label: 'Users' },
  { value: 'BarChart3', label: 'Bar Chart' },
  { value: 'Globe', label: 'Globe' },
];

export default function StatisticsManagement() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: 'Building2',
    imageUrl: '',
    order: 0
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingStatistic 
        ? `/api/statistics/${editingStatistic.id}`
        : '/api/statistics';
      const method = editingStatistic ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchStatistics();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving statistic:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (statistic: Statistic) => {
    setEditingStatistic(statistic);
    setFormData({
      label: statistic.label,
      value: statistic.value,
      icon: statistic.icon || 'Building2',
      imageUrl: statistic.imageUrl || '',
      order: statistic.order
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) {
      return;
    }

    try {
      const response = await fetch(`/api/statistics/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error deleting statistic:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      value: '',
      icon: 'Building2',
      imageUrl: '',
      order: 0
    });
    setEditingStatistic(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>
          <p className="text-slate-600">Manage website statistics and metrics</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Statistic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStatistic ? 'Edit Statistic' : 'Add New Statistic'}
              </DialogTitle>
              <DialogDescription>
                Create or update a website statistic
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image (Optional - will override icon)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="mt-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
                {uploadingImage && <p className="text-sm text-slate-500 mt-1">Uploading...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStatistic ? 'Update' : 'Create'} Statistic
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statistics.map((statistic) => (
          <Card key={statistic.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{statistic.value}</CardTitle>
                    <CardDescription>{statistic.label}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(statistic)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(statistic.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}