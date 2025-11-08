'use client';

import { useEffect, useState } from 'react';
import { Building2, Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
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

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
  isActive: boolean;
  order: number;
  features: { id: string; title: string; order: number }[];
  services: { id: string; title: string; description?: string; order: number }[];
}

const iconOptions = [
  { value: 'Home', label: 'Home' },
  { value: 'Building2', label: 'Building' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Users', label: 'Users' },
  { value: 'Settings', label: 'Settings' },
];

const colorOptions = [
  { value: 'from-blue-600 to-cyan-600', label: 'Blue to Cyan' },
  { value: 'from-purple-600 to-pink-600', label: 'Purple to Pink' },
  { value: 'from-green-600 to-emerald-600', label: 'Green to Emerald' },
  { value: 'from-orange-600 to-red-600', label: 'Orange to Red' },
  { value: 'from-indigo-600 to-blue-600', label: 'Indigo to Blue' },
];

export default function CompaniesManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Home',
    imageUrl: '',
    color: 'from-blue-600 to-cyan-600',
    order: 0,
    features: [''],
    services: [{ title: '', description: '' }]
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        features: formData.features.filter(f => f.trim()).map(title => ({ title })),
        services: formData.services.filter(s => s.title.trim())
      };

      const url = editingCompany 
        ? `/api/companies/${editingCompany.id}`
        : '/api/companies';
      const method = editingCompany ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingCompany ? 'Company updated successfully!' : 'Company created successfully!');
        await fetchCompanies();
        setIsDialogOpen(false);
        resetForm();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save company');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      slug: company.slug,
      description: company.description,
      icon: company.icon || 'Home',
      imageUrl: company.imageUrl || '',
      color: company.color || 'from-blue-600 to-cyan-600',
      order: company.order,
      features: company.features.map(f => f.title),
      services: company.services.map(s => ({ title: s.title, description: s.description || '' }))
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;

    setIsDeleting(companyToDelete);
    try {
      const response = await fetch(`/api/companies/${companyToDelete}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Company deleted successfully!');
        await fetchCompanies();
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
      } else {
        throw new Error('Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company. Please try again.');
    } finally {
      setIsDeleting(null);
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
        const imageUrl = data.imageUrl;
        setFormData(prev => ({ ...prev, imageUrl }));
        toast.success('Image uploaded successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'Home',
      imageUrl: '',
      color: 'from-blue-600 to-cyan-600',
      order: 0,
      features: [''],
      services: [{ title: '', description: '' }]
    });
    setEditingCompany(null);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { title: '', description: '' }]
    }));
  };

  const updateService = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company and all its features and services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Companies</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your company profiles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? 'Edit Company' : 'Add New Company'}
              </DialogTitle>
              <DialogDescription>
                Create or update a company profile
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    <Label className="text-sm font-medium mb-2 block">Preview</Label>
                    <div className="relative w-32 h-32 border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load error:', formData.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
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

              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="color">Color</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(option => (
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

              <div>
                <Label>Features</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>

              <div>
                <Label>Services</Label>
                {formData.services.map((service, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-3 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        placeholder="Service title"
                      />
                      <Input
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Service description"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addService}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingCompany ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    `${editingCompany ? 'Update' : 'Create'} Company`
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
        ) : companies.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No companies yet</h3>
                <p className="text-slate-600 dark:text-slate-400">Get started by creating your first company.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          companies.map((company) => (
          <Card key={company.id} className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 dark:text-slate-100">
                    <Building2 className="w-5 h-5" />
                    {company.name}
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">{company.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={company.isActive ? 'default' : 'secondary'}>
                    {company.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(company)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(company.id)}
                    disabled={isDeleting === company.id}
                  >
                    {isDeleting === company.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1">
                    {company.features.map((feature) => (
                      <li key={feature.id} className="text-sm text-slate-600">
                        • {feature.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Services</h4>
                  <ul className="space-y-1">
                    {company.services.map((service) => (
                      <li key={service.id} className="text-sm text-slate-600">
                        • {service.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}