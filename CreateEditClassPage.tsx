import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Class } from '../lib/types';
import { createClass, updateClass, getClassById } from '../lib/dataService';
import { categories, levels } from '../lib/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CreateEditClassPageProps {
  classId?: string;
  onBack: () => void;
}

export function CreateEditClassPage({ classId, onBack }: CreateEditClassPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    seats: '',
    category: '',
    duration: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    location: 'offline' as 'online' | 'offline',
    imageUrl: '',
    videoUrl: '',
    dates: ['']
  });

  useEffect(() => {
    if (classId) {
      const cls = getClassById(classId);
      if (cls) {
        setFormData({
          title: cls.title,
          description: cls.description,
          price: cls.price.toString(),
          seats: cls.seats.toString(),
          category: cls.category,
          duration: cls.duration,
          level: cls.level,
          location: cls.location,
          imageUrl: cls.images[0] || '',
          videoUrl: cls.videoUrl || '',
          dates: cls.dates.length > 0 ? cls.dates : ['']
        });
      }
    }
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || user.role !== 'artisan') {
      toast.error('Only artisans can create classes');
      return;
    }

    setLoading(true);

    try {
      const classData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        artisanId: user.id,
        seats: parseInt(formData.seats),
        availableSeats: parseInt(formData.seats),
        dates: formData.dates.filter(d => d !== ''),
        images: formData.imageUrl ? [formData.imageUrl] : [],
        videoUrl: formData.videoUrl || undefined,
        category: formData.category,
        duration: formData.duration,
        level: formData.level,
        location: formData.location
      };

      if (classId) {
        updateClass(classId, classData);
        toast.success('Class updated successfully!');
      } else {
        createClass(classData);
        toast.success('Class created successfully!');
      }

      onBack();
    } catch (error) {
      toast.error('Failed to save class');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, '']
    }));
  };

  const removeDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const updateDate = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.map((d, i) => i === index ? value : d)
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{classId ? 'Edit Class' : 'Create New Class'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Beginner Pottery Workshop"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your class..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="85.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seats">Total Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={formData.seats}
                    onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                    placeholder="12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'All').map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g. 3 hours"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setFormData(prev => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.filter(l => l !== 'All').map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Type *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value: 'online' | 'offline') => 
                      setFormData(prev => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Paste a direct link to your class image
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, etc.)</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Add a promotional video to showcase your class
                </p>
              </div>

              <div className="space-y-2">
                <Label>Class Dates *</Label>
                {formData.dates.map((date, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => updateDate(index, e.target.value)}
                      required
                      className="flex-1"
                    />
                    {formData.dates.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeDate(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDate}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Date
                </Button>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : (classId ? 'Update Class' : 'Create Class')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
