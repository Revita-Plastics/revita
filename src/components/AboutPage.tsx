import { Mail, Phone, MapPin } from "lucide-react";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-emerald-900 mb-6">Over ReVita Plastics</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed">
          ReVita Plastics ontwerpt en produceert stijlvolle en functionele
          producten gemaakt van geupcycled plastic. We hergebruiken materialen
          die anders afval zouden worden en transformeren ze in duurzame items
          voor thuis.
        </p>

        <h2 className="text-emerald-900 mt-8 mb-4">Onze Missie</h2>
        <p className="text-gray-700 leading-relaxed">
          Onze missie is het verminderen van plasticafval door hoogwaardige
          producten te maken die lang meegaan en een lagere milieu-impact
          hebben. Elk item is ontworpen met functionaliteit, esthetiek en
          circulariteit in gedachten.
        </p>

        <h2 className="text-emerald-900 mt-8 mb-4">Onze Waarden</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>Circulair ontwerp: van afval naar waardevolle producten</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>Transparantie in materiaalgebruik en productie</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>Duurzaamheid: productlevensduur en repareerbaarheid</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-600 mt-1">•</span>
            <span>Gemeenschapsimpact: lokale verwerking en banen</span>
          </li>
        </ul>
      </div>

      <div className="mt-12 pt-12 border-t border-gray-200">
        <h2 className="text-emerald-900 mb-6">Contact Informatie</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-emerald-600 mt-1" />
            <div>
              <p className="text-gray-700">ReVita Plastics B.V.</p>
              <p className="text-gray-700"> adres</p>
              <p className="text-gray-700">adres</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-emerald-600" />
            <a
              href="tel:+31201234567"
              className="text-gray-700 hover:text-emerald-600"
            >
              +31 (0)20 123 4567
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-emerald-600" />
            <a
              href="mailto:revita.plastics@gmail.com"
              className="text-gray-700 hover:text-emerald-600"
            >
              revita.plastics@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
