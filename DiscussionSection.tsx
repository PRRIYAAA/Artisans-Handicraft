import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card } from './ui/card';
import { MessageCircle, Send, Trash2, Reply } from 'lucide-react';
import { Discussion } from '../lib/types';
import { getDiscussionsByClass, createDiscussion, deleteDiscussion } from '../lib/dataService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface DiscussionSectionProps {
  classId: string;
}

export function DiscussionSection({ classId }: DiscussionSectionProps) {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadDiscussions();
  }, [classId]);

  const loadDiscussions = () => {
    const classDiscussions = getDiscussionsByClass(classId);
    setDiscussions(classDiscussions);
  };

  const handlePostComment = () => {
    if (!user) {
      toast.error('Please sign in to post a comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    createDiscussion({
      classId,
      userId: user.id,
      content: newComment.trim()
    });

    setNewComment('');
    loadDiscussions();
    toast.success('Comment posted successfully');
  };

  const handlePostReply = (parentId: string) => {
    if (!user) {
      toast.error('Please sign in to post a reply');
      return;
    }

    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    createDiscussion({
      classId,
      userId: user.id,
      content: replyContent.trim(),
      parentId
    });

    setReplyContent('');
    setReplyingTo(null);
    loadDiscussions();
    toast.success('Reply posted successfully');
  };

  const handleDeleteComment = (id: string) => {
    if (deleteDiscussion(id)) {
      loadDiscussions();
      toast.success('Comment deleted successfully');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">
            Discussion ({discussions.length})
          </h3>
        </div>
      </div>

      {/* New Comment Input */}
      {user && (
        <Card className="p-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Ask a question or share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handlePostComment} size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Discussion List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No discussions yet. Be the first to ask a question!
            </p>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} className="p-4">
              <div className="flex space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={discussion.user?.avatarUrl} alt={discussion.user?.name} />
                  <AvatarFallback>
                    {discussion.user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{discussion.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(discussion.createdAt)}</p>
                    </div>
                    {user?.id === discussion.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(discussion.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{discussion.content}</p>
                  
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === discussion.id ? null : discussion.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}

                  {/* Reply Input */}
                  {replyingTo === discussion.id && (
                    <div className="mt-3 pl-4 border-l-2 border-primary space-y-2">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePostReply(discussion.id)}
                        >
                          Post Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {discussion.replies && discussion.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-border space-y-3">
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.user?.avatarUrl} alt={reply.user?.name} />
                            <AvatarFallback>
                              {reply.user?.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm text-foreground">{reply.user?.name}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</p>
                              </div>
                              {user?.id === reply.userId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteComment(reply.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
