import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Clock, MapPin, Users, Star } from 'lucide-react';
import { Class } from '../lib/types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClassCardProps {
  class: Class;
  onViewDetails: (classId: string) => void;
}

export function ClassCard({ class: classData, onViewDetails }: ClassCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <ImageWithFallback 
          src={classData.images[0]}
          alt={classData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={classData.location === 'online' ? 'secondary' : 'default'}>
            {classData.location}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            ${classData.price}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1 mr-2">
            {classData.title}
          </h3>
          <Badge variant="outline" className="text-xs capitalize">
            {classData.level}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {classData.description}
        </p>

        {/* Artisan */}
        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={classData.artisan?.avatarUrl} alt={classData.artisan?.name} />
            <AvatarFallback className="text-xs">
              {classData.artisan?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{classData.artisan?.name}</span>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">4.8</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{classData.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{classData.availableSeats}/{classData.seats} spots</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="capitalize">{classData.category}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onViewDetails(classData.id)}
          className="w-full"
          variant={classData.availableSeats === 0 ? "secondary" : "default"}
          disabled={classData.availableSeats === 0}
        >
          {classData.availableSeats === 0 ? 'Fully Booked' : 'View Details'}
        </Button>
      </div>
    </div>
  );
}