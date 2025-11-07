import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample companies
  const roomyFinder = await prisma.company.create({
    data: {
      name: 'Roomy Finder',
      slug: 'roomy-finder',
      description: 'Find your perfect living space with our intelligent property matching platform',
      icon: 'Home',
      color: 'from-blue-600 to-cyan-600',
      order: 0,
      features: {
        create: [
          { title: 'AI-powered recommendations', order: 0 },
          { title: 'Virtual tours', order: 1 },
          { title: 'Price comparisons', order: 2 },
          { title: 'Neighborhood insights', order: 3 }
        ]
      },
      services: {
        create: [
          { title: 'Property Search', description: 'Advanced search algorithms', order: 0 },
          { title: 'Virtual Tours', description: '360-degree property viewing', order: 1 }
        ]
      }
    }
  });

  const itSolutions = await prisma.company.create({
    data: {
      name: 'IT Solutions',
      slug: 'it-solutions',
      description: 'Cutting-edge technology solutions to transform your business operations',
      icon: 'Laptop',
      color: 'from-purple-600 to-pink-600',
      order: 1,
      features: {
        create: [
          { title: 'Cloud infrastructure', order: 0 },
          { title: 'Cybersecurity', order: 1 },
          { title: 'Software development', order: 2 },
          { title: 'IT consulting', order: 3 }
        ]
      },
      services: {
        create: [
          { title: 'Cloud Migration', description: 'Seamless cloud transition', order: 0 },
          { title: 'Security Audit', description: 'Comprehensive security assessment', order: 1 }
        ]
      }
    }
  });

  const realEstate = await prisma.company.create({
    data: {
      name: 'Real Estate',
      slug: 'real-estate',
      description: 'Premium real estate services for residential and commercial properties',
      icon: 'Building2',
      color: 'from-green-600 to-emerald-600',
      order: 2,
      features: {
        create: [
          { title: 'Property management', order: 0 },
          { title: 'Investment analysis', order: 1 },
          { title: 'Market research', order: 2 },
          { title: 'Legal support', order: 3 }
        ]
      },
      services: {
        create: [
          { title: 'Property Sales', description: 'Residential and commercial', order: 0 },
          { title: 'Market Analysis', description: 'Real-time market insights', order: 1 }
        ]
      }
    }
  });

  const consulting = await prisma.company.create({
    data: {
      name: 'Consulting',
      slug: 'consulting',
      description: 'Strategic business consulting to drive growth and innovation',
      icon: 'Users',
      color: 'from-orange-600 to-red-600',
      order: 3,
      features: {
        create: [
          { title: 'Business strategy', order: 0 },
          { title: 'Process optimization', order: 1 },
          { title: 'Change management', order: 2 },
          { title: 'Risk assessment', order: 3 }
        ]
      },
      services: {
        create: [
          { title: 'Strategy Planning', description: 'Long-term business strategy', order: 0 },
          { title: 'Process Improvement', description: 'Operational excellence', order: 1 }
        ]
      }
    }
  });

  const investment = await prisma.company.create({
    data: {
      name: 'Investment',
      slug: 'investment',
      description: 'Smart investment opportunities with expert guidance and analysis',
      icon: 'TrendingUp',
      color: 'from-indigo-600 to-blue-600',
      order: 4,
      features: {
        create: [
          { title: 'Portfolio management', order: 0 },
          { title: 'Risk analysis', order: 1 },
          { title: 'Market insights', order: 2 },
          { title: 'Wealth planning', order: 3 }
        ]
      },
      services: {
        create: [
          { title: 'Portfolio Management', description: 'Diversified investment strategies', order: 0 },
          { title: 'Risk Assessment', description: 'Comprehensive risk analysis', order: 1 }
        ]
      }
    }
  });

  // Create statistics
  await prisma.statistic.createMany({
    data: [
      { label: 'Properties Managed', value: '10,000+', icon: 'Building2', order: 0 },
      { label: 'IT Projects Completed', value: '500+', icon: 'Laptop', order: 1 },
      { label: 'Consulting Clients', value: '1,000+', icon: 'Users', order: 2 },
      { label: 'Investment Portfolio', value: '$500M+', icon: 'TrendingUp', order: 3 }
    ]
  });

  // Create testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        company: 'Tech Innovations Inc.',
        role: 'CEO',
        content: 'GSC Capital Group transformed our business with their comprehensive IT solutions and strategic consulting.',
        rating: 5,
        order: 0
      },
      {
        name: 'Michael Chen',
        company: 'Global Properties Ltd.',
        role: 'Managing Director',
        content: 'Their real estate expertise helped us find the perfect commercial space for our expansion.',
        rating: 5,
        order: 1
      },
      {
        name: 'Emily Rodriguez',
        company: 'StartUp Ventures',
        role: 'Founder',
        content: 'The investment guidance from GSC Capital Group has been invaluable for our growth strategy.',
        rating: 5,
        order: 2
      }
    ]
  });

  // Create services
  await prisma.service.createMany({
    data: [
      {
        title: 'Property Search & Discovery',
        description: 'Advanced algorithms to match you with perfect properties',
        category: 'property',
        icon: 'Search',
        order: 0
      },
      {
        title: 'Cybersecurity Solutions',
        description: 'Protect your business with enterprise-grade security',
        category: 'tech',
        icon: 'Shield',
        order: 1
      },
      {
        title: 'Market Analysis',
        description: 'Data-driven insights for informed decision making',
        category: 'business',
        icon: 'BarChart3',
        order: 2
      },
      {
        title: 'Strategic Planning',
        description: 'Custom strategies for sustainable business growth',
        category: 'consulting',
        icon: 'Lightbulb',
        order: 3
      }
    ]
  });

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@gsccapitalgroup.com',
      name: 'Admin User',
      role: 'admin'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });