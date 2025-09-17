import { ExternalLink } from 'lucide-react';
import { CategoryData } from '../types';

interface LinksPageProps {
  category: string;
  onBack: () => void;
}

export const categoryData: Record<string, CategoryData> = {
  fines: {
    title: 'Fines & Penalties',
    description: 'Pay and manage your parking fines, speeding tickets, and penalty charge notices',
    icon: 'AlertTriangle',
    sections: [
      {
        title: 'Parking Fines',
        description: 'Council parking fines and penalty charge notices',
        links: [
          {
            title: 'Pay Penalty Charge Notice (PCN)',
            description: 'Official government portal for paying penalty charges',
            url: 'https://www.gov.uk/pay-penalty-charge-notice',
            type: 'payment'
          },
          {
            title: 'Challenge a Parking Fine',
            description: 'How to appeal or challenge a parking fine',
            url: 'https://www.gov.uk/parking-tickets/appealing',
            type: 'information'
          },
          {
            title: 'Find Your Local Council',
            description: 'Contact details for local council parking services',
            url: 'https://www.gov.uk/find-local-council',
            type: 'information'
          }
        ]
      },
      {
        title: 'Speeding Fines',
        description: 'Fixed penalty notices and speed camera fines',
        links: [
          {
            title: 'Pay Fixed Penalty Notice',
            description: 'Pay your speeding fine online',
            url: 'https://www.gov.uk/pay-fixed-penalty-notice',
            type: 'payment'
          },
          {
            title: 'Speed Awareness Course',
            description: 'Book or find information about speed awareness courses',
            url: 'https://www.speedawareness.org/',
            type: 'information'
          },
          {
            title: 'Challenge Speeding Fine',
            description: 'How to contest a speeding ticket',
            url: 'https://www.gov.uk/speeding-penalties/challenging',
            type: 'information'
          }
        ]
      },
      {
        title: 'Other Penalties',
        description: 'Bus lane fines, littering, and other penalty charges',
        links: [
          {
            title: 'Bus Lane Enforcement',
            description: 'Information about bus lane fines and appeals',
            url: 'https://tfl.gov.uk/modes/driving/red-routes/rules-of-red-routes/bus-lanes',
            type: 'information'
          },
          {
            title: 'Moving Traffic Enforcement',
            description: 'Box junction, banned turns, and moving traffic violations',
            url: 'https://tfl.gov.uk/modes/driving/red-routes/rules-of-red-routes',
            type: 'information'
          }
        ]
      }
    ]
  },
  charges: {
    title: 'Road Charges',
    description: 'Pay road tolls, congestion charges, and crossing fees',
    icon: 'Calendar',
    sections: [
      {
        title: 'Dartford Crossing',
        description: 'Dart Charge payment and account management',
        links: [
          {
            title: 'Pay Dart Charge or Fine',
            description: 'Pay for Dartford Crossing online or Create an account',
            url: 'https://www.gov.uk/pay-dartford-crossing-charge',
            type: 'payment'
          }
        ]
      },
      {
        title: 'London Congestion Charge',
        description: 'Congestion Charge and Ultra Low Emission Zone',
        links: [
          {
            title: 'Pay Congestion Charge',
            description: 'Pay London Congestion Charge online',
            url: 'https://tfl.gov.uk/modes/driving/pay-to-drive-in-london',
            type: 'payment'
          },
          {
            title: 'ULEZ Payment',
            description: 'Pay Ultra Low Emission Zone charge',
            url: 'https://tfl.gov.uk/modes/driving/ultra-low-emission-zone',
            type: 'payment'
          },
          {
            title: 'Auto Pay Setup',
            description: 'Set up automatic payment for daily travel',
            url: 'https://tfl.gov.uk/modes/driving/congestion-charge/auto-pay',
            type: 'government'
          }
        ]
      },
      {
        title: 'Other Road Charges',
        description: 'Clean Air Zones and local authority charges',
        links: [
          {
            title: 'Clean Air Zone Checker & Payment',
            description: 'Check if your vehicle needs to pay clean air charges or pay online',
            url: 'https://www.gov.uk/clean-air-zones',
            type: 'information'
          }
        ]
      }
    ]
  },
  insurance: {
    title: 'Car Insurance',
    description: 'Compare, buy, and manage your car insurance policies',
    icon: 'Shield',
    sections: [
      {
        title: 'Compare Insurance',
        description: 'Find the best car insurance deals',
        links: [
          {
            title: 'Compare the Market',
            description: 'Compare car insurance quotes from multiple providers',
            url: 'https://www.comparethemarket.com/car-insurance/',
            type: 'comparison'
          },
          {
            title: 'MoneySuperMarket',
            description: 'Compare cheap car insurance quotes',
            url: 'https://www.moneysupermarket.com/car-insurance/',
            type: 'comparison'
          },
          {
            title: 'GoCompare',
            description: 'Compare car insurance prices and policies',
            url: 'https://www.gocompare.com/car-insurance/',
            type: 'comparison'
          },
          {
            title: 'Confused.com',
            description: 'Compare car insurance quotes online',
            url: 'https://www.confused.com/car-insurance',
            type: 'comparison'
          }
        ]
      },
      {
        title: 'Insurance Information',
        description: 'Useful resources and government information',
        links: [
          {
            title: 'Motor Insurance Database',
            description: 'Check if a vehicle is insured (MID)',
            url: 'https://enquiry.navigate.mib.org.uk/checkyourvehicle',
            type: 'information'
          },
          {
            title: 'Insurance Claims',
            description: 'How to make a car insurance claim',
            url: 'https://www.citizensadvice.org.uk/consumer/insurance/insurance-claims/making-a-claim-on-your-insurance-policy/',
            type: 'information'
          }
        ]
      }
    ]
  },
  mot: {
    title: 'MOT & Vehicle Tax',
    description: 'MOT tests, vehicle tax, and DVLA services',
    icon: 'CheckCircle',
    sections: [
      {
        title: 'MOT Services',
        description: 'MOT testing and certificates',
        links: [
          {
            title: 'Check MOT Status',
            description: 'Check when your MOT expires and view history',
            url: 'https://www.gov.uk/check-mot-status',
            type: 'government'
          },
          {
            title: 'MOT Reminder Service',
            description: 'Get email or text reminders for MOT due date',
            url: 'https://www.gov.uk/mot-reminder',
            type: 'government'
          },
          {
            title: 'Find MOT Test Centre',
            description: 'Find an MOT test centre near you',
            url: 'https://www.google.com/maps/search/MOT+Test+Centre+Near+Me',
            type: 'information'
          }
        ]
      },
      {
        title: 'Vehicle Tax (Road Tax)',
        description: 'Tax your vehicle and manage payments',
        links: [
          {
            title: 'Tax Your Vehicle',
            description: 'Pay vehicle tax (road tax) online',
            url: 'https://www.gov.uk/vehicle-tax',
            type: 'payment'
          },
          {
            title: 'Check Vehicle Tax',
            description: 'Check if vehicle tax has been paid',
            url: 'https://www.gov.uk/check-vehicle-tax',
            type: 'government'
          },
          {
            title: 'SORN Declaration',
            description: 'Declare your vehicle off road (SORN)',
            url: 'https://www.gov.uk/make-a-sorn',
            type: 'government'
          }
        ]
      },
      {
        title: 'DVLA Services',
        description: 'Driving licences and vehicle registration',
        links: [
          {
            title: 'DVLA Online Services',
            description: 'Access all DVLA services online',
            url: 'https://www.gov.uk/browse/driving/drivers-lorries-buses',
            type: 'government'
          },
          {
            title: 'Vehicle Registration',
            description: 'Register a new vehicle or transfer ownership',
            url: 'https://www.gov.uk/vehicle-registration',
            type: 'government'
          },
          {
            title: 'Driver Medical',
            description: 'Medical conditions and driving',
            url: 'https://www.gov.uk/driving-medical-conditions',
            type: 'information'
          }
        ]
      }
    ]
  }
};

export default function LinksPage({ category, onBack }: LinksPageProps) {
  const data = categoryData[category];

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Category not found</p>
        <button onClick={onBack} className="mt-4 btn-primary">Go Back</button>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'government':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'comparison':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'information':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Payment';
      case 'government':
        return 'Official';
      case 'comparison':
        return 'Compare';
      case 'information':
        return 'Info';
      default:
        return 'Link';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        <p className="text-gray-600 mt-1">{data.description}</p>
      </div>

      {data.sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{section.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.links.map((link, linkIndex) => (
              <a
                key={linkIndex}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {link.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(link.type)}`}>
                        {getTypeLabel(link.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-2 flex-shrink-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
