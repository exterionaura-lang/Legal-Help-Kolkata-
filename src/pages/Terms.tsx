import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-600 text-lg">
            Please read these terms carefully before using our platform.
          </p>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 text-white p-10">
            <CardTitle className="text-2xl">Legal Agreement</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>1. No Legal Advice</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                This platform does not provide legal advice of any kind. All information is for general informational purposes only.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <h2>2. No Solicitation</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                In accordance with Bar Council of India rules, no solicitation of clients is made. Advocates are listed purely as a directory service.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>3. Independent Advocates</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All advocates are independent professionals. Legal Help Kolkata is not responsible for services provided by any listed advocate.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>4. No Liability</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Legal Help Kolkata shall not be liable for any damages arising from the use of this platform or reliance on information provided herein.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>5. Data Privacy</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                User queries are strictly confidential and visible only to admin. Contact details of users and advocates are never publicly disclosed.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>6. BCI Compliance</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                This platform operates in full compliance with Bar Council of India Rules, 1975, on advertising, solicitation, and professional conduct.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-slate-900 font-bold text-xl">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h2>7. General Information</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All content including the legal blog is for general information only. Users must consult a qualified advocate for advice specific to their situation.
              </p>
            </section>

            <div className="pt-10 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-400 italic">
                Last updated: April 2026. Legal Help Kolkata reserves the right to modify these terms at any time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
