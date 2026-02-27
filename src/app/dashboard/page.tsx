import Link from "next/link";
import { Box, Users, MessageSquare } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-8 relative">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-brown tracking-tight">LIVORA</h1>
                    <p className="text-charcoal/60 mt-3 text-lg font-light">
                        Premium Furniture Design Studio
                    </p>
                    <div className="w-24 h-1 bg-gold mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link
                        href="/admin/3d-visualization"
                        className="group bg-white rounded-2xl p-8 shadow-sm border border-silver/50 hover:shadow-lg hover:border-gold/50 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-brown/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brown/20 transition-colors">
                            <Box className="w-7 h-7 text-brown" />
                        </div>
                        <h2 className="text-xl font-semibold text-charcoal mb-2">3D Visualization</h2>
                        <p className="text-charcoal/50 text-sm leading-relaxed">
                            Real-time 3D rendering with camera controls, lighting effects, and shading options.
                        </p>
                        <span className="inline-block mt-4 text-gold text-sm font-medium">
                            Admin Panel &rarr;
                        </span>
                    </Link>

                    <Link
                        href="/admin/consultations"
                        className="group bg-white rounded-2xl p-8 shadow-sm border border-silver/50 hover:shadow-lg hover:border-gold/50 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-brown/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brown/20 transition-colors">
                            <Users className="w-7 h-7 text-brown" />
                        </div>
                        <h2 className="text-xl font-semibold text-charcoal mb-2">Consultation Management</h2>
                        <p className="text-charcoal/50 text-sm leading-relaxed">
                            Manage consultation requests, update statuses, and respond to customers.
                        </p>
                        <span className="inline-block mt-4 text-gold text-sm font-medium">
                            Admin Panel &rarr;
                        </span>
                    </Link>

                    <Link
                        href="/consultation-request"
                        className="group bg-white rounded-2xl p-8 shadow-sm border border-silver/50 hover:shadow-lg hover:border-gold/50 transition-all duration-300"
                    >
                        <div className="w-14 h-14 bg-brown/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brown/20 transition-colors">
                            <MessageSquare className="w-7 h-7 text-brown" />
                        </div>
                        <h2 className="text-xl font-semibold text-charcoal mb-2">Consultation Request</h2>
                        <p className="text-charcoal/50 text-sm leading-relaxed">
                            Book a design consultation with room details and preferred visit date.
                        </p>
                        <span className="inline-block mt-4 text-gold text-sm font-medium">
                            User Panel &rarr;
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
