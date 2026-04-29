import { motion } from 'framer-motion';
import { Mail, Clock, MessageSquare, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Us",
      value: "1legalhelpkolkata@gmail.com",
      link: "mailto:1legalhelpkolkata@gmail.com"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-green-600" />,
      title: "WhatsApp",
      value: "8697457657",
      link: "https://wa.me/918697457657"
    },
    {
      icon: <Clock className="w-6 h-6 text-slate-600" />,
      title: "Office Hours",
      value: "9:00 AM to 7:00 PM",
      subValue: "Monday to Saturday"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Contact Us</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-none shadow-md hover:shadow-xl transition-all rounded-2xl overflow-hidden h-full">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    {info.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">{info.title}</h3>
                    <p className="text-xl font-medium text-slate-700">{info.value}</p>
                    {info.subValue && <p className="text-sm text-slate-500">{info.subValue}</p>}
                    {info.link && (
                      <Button render={<a href={info.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">Get in touch <ExternalLink className="w-3 h-3" /></a>} variant="link" className="p-0 h-auto text-blue-600 font-bold mt-2" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900 rounded-3xl p-12 text-white text-center space-y-6">
          <MapPin className="w-12 h-12 text-blue-400 mx-auto" />
          <h2 className="text-3xl font-bold">Our Location</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Serving the legal community and public across Kolkata and West Bengal.
          </p>
          <div className="pt-6">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 py-7 text-lg font-bold">
              View on Google Maps
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
