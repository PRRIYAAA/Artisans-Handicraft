import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Heart, Users, Award, Target } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Craft',
      description: 'We believe in preserving traditional arts and crafts for future generations through hands-on learning experiences.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a supportive community where artisans and learners can connect, share, and grow together.'
    },
    {
      icon: Award,
      title: 'Quality Excellence',
      description: 'Every class is carefully curated to ensure the highest quality learning experience and authentic techniques.'
    },
    {
      icon: Target,
      title: 'Accessible Learning',
      description: 'Making traditional crafts accessible to everyone, regardless of skill level or background.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former craft museum curator with 15 years of experience in traditional arts preservation.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612db8e?w=400'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Artisan Relations',
      bio: 'Master woodworker and educator who helps connect traditional craftspeople with our platform.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Learning Experience Director',
      bio: 'Educational psychologist focused on hands-on learning methodologies and student success.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-artisan-about">
      <div className="artisan-content-overlay">
      {/* Hero Section */}
      <section className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Preserving Traditions Through Learning
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At Handicraft Artisans, we're passionate about connecting master craftspeople 
              with eager learners, ensuring that traditional skills and techniques are passed 
              down to future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, Handicraft Artisans was born from a simple observation: 
                  traditional crafts were slowly disappearing as master artisans aged without 
                  passing on their knowledge to new generations.
                </p>
                <p>
                  Our founder, Sarah Chen, spent years working in craft museums and saw 
                  firsthand how many beautiful techniques were being lost. She envisioned 
                  a platform where experienced artisans could share their expertise with 
                  passionate learners in meaningful, hands-on ways.
                </p>
                <p>
                  Today, we've connected thousands of learners with master craftspeople, 
                  creating a thriving community that celebrates both tradition and innovation 
                  in the world of handmade crafts.
                </p>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1560695717-9bb18664a583?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdHMlMjBtYXJrZXRwbGFjZSUyMGFydGlzYW58ZW58MXx8fHwxNzU3NDA4MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Artisan workshop"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">
              The passionate people behind Handicraft Artisans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#6B4423] to-[#8B5A3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Together, we're making a difference in preserving traditional crafts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">500+</div>
              <div className="text-primary-foreground/90">Active Classes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">100+</div>
              <div className="text-primary-foreground/90">Expert Artisans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">10K+</div>
              <div className="text-primary-foreground/90">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">25+</div>
              <div className="text-primary-foreground/90">Craft Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            To create a thriving global community where traditional crafts flourish, 
            master artisans are celebrated, and passionate learners can discover the 
            joy of creating beautiful, meaningful objects with their own hands.
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}