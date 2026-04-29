import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, UserCircle, Calendar, PlusCircle, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogProps {
  user: User | null;
  role: string | null;
}

interface Post {
  id: string;
  category: string;
  question: string;
  authorName: string;
  createdAt: any;
}

interface Answer {
  id: string;
  postId: string;
  answer: string;
  authorName: string;
  authorRole: string;
  advocateUid: string;
  createdAt: any;
}

export default function Blog({ user, role }: BlogProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer[]>>({});
  const [newQuestion, setNewQuestion] = useState({ category: '', question: '' });
  const [newAnswer, setNewAnswer] = useState<Record<string, string>>({});
  const [contributorNames, setContributorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApprovedAdvocate, setIsApprovedAdvocate] = useState(false);

  useEffect(() => {
    if (user && role === 'advocate') {
      const checkApproval = async () => {
        const advDoc = await getDoc(doc(db, 'advocates', user.uid));
        if (advDoc.exists() && advDoc.data().status === 'approved') {
          setIsApprovedAdvocate(true);
        }
      };
      checkApproval();
    }
  }, [user, role]);

  useEffect(() => {
    const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[];
      setPosts(docs);
      setLoading(false);

      // Listen for answers for each post
      docs.forEach(post => {
        const aq = query(collection(db, `blog_posts/${post.id}/answers`), orderBy('createdAt', 'asc'));
        onSnapshot(aq, (aSnapshot) => {
          const aDocs = aSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Answer[];
          setAnswers(prev => ({ ...prev, [post.id]: aDocs }));
        });
      });
    });

    return () => unsubscribePosts();
  }, []);

  const handlePostQuestion = async () => {
    if (!newQuestion.category || !newQuestion.question) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'blog_posts'), {
        ...newQuestion,
        authorName: user?.displayName || 'Anonymous',
        createdAt: serverTimestamp()
      });
      setNewQuestion({ category: '', question: '' });
      setIsDialogOpen(false);
      toast.success('Question posted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'blog_posts');
      toast.error('Failed to post question.');
    }
  };

  const handlePostAnswer = async (postId: string) => {
    const answerText = newAnswer[postId];
    if (!answerText) return;

    const name = user?.displayName || contributorNames[postId] || 'Anonymous Contributor';

    const path = `blog_posts/${postId}/answers`;
    try {
      await addDoc(collection(db, path), {
        postId,
        answer: answerText,
        authorName: name,
        authorRole: role || 'guest',
        advocateUid: user?.uid || 'anonymous',
        createdAt: serverTimestamp()
      });
      
      setNewAnswer(prev => ({ ...prev, [postId]: '' }));
      setContributorNames(prev => ({ ...prev, [postId]: '' }));
      toast.success('Response posted successfully!');
    } catch (error) {
      console.error('Error posting answer:', error);
      handleFirestoreError(error, OperationType.CREATE, path);
      toast.error('Failed to post answer.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please check permissions.');
    }
  };

  const handleDeleteAnswer = async (postId: string, answerId: string) => {
    try {
      await deleteDoc(doc(db, `blog_posts/${postId}/answers`, answerId));
      toast.success('Answer deleted successfully');
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast.error('Failed to delete answer. Please check permissions.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header with Background */}
      <div className="relative py-32 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://picsum.photos/seed/legal-blog/1920/1080?blur=4")',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
          <h1 className="text-6xl font-bold text-white tracking-tight">Free Legal Help Blog</h1>
          <p className="text-slate-200 text-2xl max-w-3xl mx-auto font-light">
            An open platform for legal awareness and professional Q&A.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-24 w-full flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl py-8 px-10 text-xl font-bold shadow-xl shadow-blue-200 transition-all hover:scale-105">
                <PlusCircle className="mr-3 h-6 w-6" /> Ask a Question
              </Button>
            } />
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Ask a Legal Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <Select 
                    value={newQuestion.category}
                    onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Property Dispute">Property Dispute</SelectItem>
                      <SelectItem value="Family Law">Family Law</SelectItem>
                      <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                      <SelectItem value="Civil Law">Civil Law</SelectItem>
                      <SelectItem value="Consumer Rights">Consumer Rights</SelectItem>
                      <SelectItem value="Labor & Employment">Labor & Employment</SelectItem>
                      <SelectItem value="Cyber Law">Cyber Law</SelectItem>
                      <SelectItem value="Taxation">Taxation</SelectItem>
                      <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                      <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                      <SelectItem value="Human Rights">Human Rights</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Question</label>
                  <Textarea 
                    placeholder="Describe your question clearly..." 
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="min-h-[120px] rounded-xl"
                  />
                </div>
                <Button onClick={handlePostQuestion} className="w-full bg-slate-900 rounded-xl py-6 font-bold">
                  Post Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <Card key={post.id} className="border-none shadow-lg rounded-3xl overflow-hidden bg-white transition-all hover:shadow-xl">
                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-4 py-1.5 text-sm font-bold">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                      {post.createdAt && format(post.createdAt.toDate(), 'PPP')}
                    </div>
                    {role === 'admin' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
                    {post.question}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-6 text-sm text-slate-500 font-medium">
                    <div className="bg-slate-200 p-1.5 rounded-full">
                      <UserCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <span>Posted by {post.authorName}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <ScrollArea className="max-h-[500px]">
                    <div className="p-8 space-y-8">
                      <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                        <MessageSquare className="w-4 h-4" />
                        Professional Guidance ({answers[post.id]?.length || 0})
                      </div>
                      
                      {answers[post.id]?.length > 0 ? (
                        answers[post.id].map((ans) => (
                          <div key={ans.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4 relative group/answer">
                            <p className="text-slate-700 text-lg leading-relaxed">{ans.answer}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200/50">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-600 p-1.5 rounded-full shadow-md shadow-blue-200">
                                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm font-bold text-slate-900">{ans.authorName}</span>
                                {ans.advocateUid !== 'anonymous' && (
                                  <Badge variant="outline" className="text-[10px] py-0 h-5 border-blue-200 text-blue-600 uppercase font-black tracking-widest">{ans.authorRole || 'Contributor'}</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-400 font-medium">
                                  {ans.createdAt && format(ans.createdAt.toDate(), 'MMM d, yyyy')}
                                </span>
                                {role === 'admin' && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteAnswer(post.id, ans.id)}
                                    className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover/answer:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                          <p className="text-slate-400 font-medium italic">No professional guidance provided yet. Verified advocates are reviewing this inquiry.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>

                <CardFooter className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
                  {!user && (
                    <Input 
                      placeholder="Your Name (Optional)" 
                      className="rounded-xl bg-white border-slate-200"
                      value={contributorNames[post.id] || ''}
                      onChange={(e) => setContributorNames(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                  )}
                  <div className="w-full flex gap-4">
                    <Textarea 
                      placeholder="Provide your guidance or answer..." 
                      className="rounded-2xl bg-white min-h-[100px] p-5 text-lg shadow-sm border-slate-200 focus:ring-blue-500/20 transition-all"
                      value={newAnswer[post.id] || ''}
                      onChange={(e) => setNewAnswer(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <Button 
                      onClick={() => handlePostAnswer(post.id)}
                      className="bg-slate-900 hover:bg-slate-800 h-auto px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      <Send className="w-6 h-6" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
