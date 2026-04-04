import pool from '../src/config/dbConnection.js';
import bcrypt from 'bcryptjs';

const thanasData = [
    // Dhaka (5)
    {
        thana_name: 'Ramna Police Station',
        district: 'Dhaka',
        zone: 'DMP Ramna',
        address: 'Ramna, Dhaka-1000',
        phone: '02-9558131',
        email: 'ramna@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Gulshan Police Station',
        district: 'Dhaka',
        zone: 'DMP Gulshan',
        address: 'Gulshan-2, Dhaka-1212',
        phone: '02-8829513',
        email: 'gulshan@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Dhanmondi Police Station',
        district: 'Dhaka',
        zone: 'DMP Dhanmondi',
        address: 'Dhanmondi, Dhaka-1205',
        phone: '02-9665222',
        email: 'dhanmondi@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Mirpur Model Police Station',
        district: 'Dhaka',
        zone: 'DMP Mirpur',
        address: 'Mirpur-10, Dhaka-1216',
        phone: '02-9006421',
        email: 'mirpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Mohammadpur Police Station',
        district: 'Dhaka',
        zone: 'DMP Mohammadpur',
        address: 'Mohammadpur, Dhaka-1207',
        phone: '02-9123145',
        email: 'mohammadpur@gmail.com',
        password: 'thana@123'
    },

    // Gazipur (5)
    {
        thana_name: 'Gazipur Sadar Police Station',
        district: 'Gazipur',
        zone: 'Gazipur Sadar',
        address: 'Gazipur Sadar, Gazipur-1700',
        phone: '02-9202165',
        email: 'gazipursadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Tongi Police Station',
        district: 'Gazipur',
        zone: 'Tongi',
        address: 'Tongi, Gazipur-1710',
        phone: '02-9801122',
        email: 'tongi@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kaliakair Police Station',
        district: 'Gazipur',
        zone: 'Kaliakair',
        address: 'Kaliakair, Gazipur-1750',
        phone: '02-9203344',
        email: 'kaliakair@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kaliganj Police Station',
        district: 'Gazipur',
        zone: 'Kaliganj',
        address: 'Kaliganj, Gazipur-1720',
        phone: '02-9802233',
        email: 'kaliganj@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Sreepur Police Station',
        district: 'Gazipur',
        zone: 'Sreepur',
        address: 'Sreepur, Gazipur-1740',
        phone: '02-9205566',
        email: 'sreepur@gmail.com',
        password: 'thana@123'
    },

    // Tangail (5)
    {
        thana_name: 'Tangail Sadar Police Station',
        district: 'Tangail',
        zone: 'Tangail Sadar',
        address: 'Tangail Sadar, Tangail-1900',
        phone: '0921-55111',
        email: 'tangailsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kalihati Police Station',
        district: 'Tangail',
        zone: 'Kalihati',
        address: 'Kalihati, Tangail-1910',
        phone: '0921-55222',
        email: 'kalihati@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Gopalpur Police Station',
        district: 'Tangail',
        zone: 'Gopalpur',
        address: 'Gopalpur, Tangail-1990',
        phone: '0921-55333',
        email: 'gopalpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Mirzapur Police Station',
        district: 'Tangail',
        zone: 'Mirzapur',
        address: 'Mirzapur, Tangail-1940',
        phone: '0921-55444',
        email: 'mirzapur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Ghatail Police Station',
        district: 'Tangail',
        zone: 'Ghatail',
        address: 'Ghatail, Tangail-1980',
        phone: '0921-55555',
        email: 'ghatail@gmail.com',
        password: 'thana@123'
    },

    // Munshiganj (5)
    {
        thana_name: 'Munshiganj Sadar Police Station',
        district: 'Munshiganj',
        zone: 'Munshiganj Sadar',
        address: 'Munshiganj Sadar, Munshiganj-1500',
        phone: '02-7611122',
        email: 'munshiganjsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Sreenagar Police Station',
        district: 'Munshiganj',
        zone: 'Sreenagar',
        address: 'Sreenagar, Munshiganj-1550',
        phone: '02-7612233',
        email: 'sreenagar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Louhajang Police Station',
        district: 'Munshiganj',
        zone: 'Louhajang',
        address: 'Louhajang, Munshiganj-1530',
        phone: '02-7613344',
        email: 'louhajang@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Tongibari Police Station',
        district: 'Munshiganj',
        zone: 'Tongibari',
        address: 'Tongibari, Munshiganj-1540',
        phone: '02-7614455',
        email: 'tongibari@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Sirajdikhan Police Station',
        district: 'Munshiganj',
        zone: 'Sirajdikhan',
        address: 'Sirajdikhan, Munshiganj-1510',
        phone: '02-7615566',
        email: 'sirajdikhan@gmail.com',
        password: 'thana@123'
    },

    // Chattogram (5)
    {
        thana_name: 'Kotwali Police Station',
        district: 'Chattogram',
        zone: 'CMP Kotwali',
        address: 'Kotwali, Chattogram-4000',
        phone: '031-610244',
        email: 'kotwali@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Panchlaish Police Station',
        district: 'Chattogram',
        zone: 'CMP Panchlaish',
        address: 'Panchlaish, Chattogram-4203',
        phone: '031-656789',
        email: 'panchlaish@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Halishahar Police Station',
        district: 'Chattogram',
        zone: 'CMP Halishahar',
        address: 'Halishahar, Chattogram-4230',
        phone: '031-681234',
        email: 'halishahar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Chandgaon Police Station',
        district: 'Chattogram',
        zone: 'CMP Chandgaon',
        address: 'Chandgaon, Chattogram-4212',
        phone: '031-655432',
        email: 'chandgaon@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Patenga Police Station',
        district: 'Chattogram',
        zone: 'CMP Patenga',
        address: 'Patenga, Chattogram-4204',
        phone: '031-633221',
        email: 'patenga@gmail.com',
        password: 'thana@123'
    },

    // Rajshahi (5)
    {
        thana_name: 'Boalia Police Station',
        district: 'Rajshahi',
        zone: 'RMP Boalia',
        address: 'Boalia, Rajshahi-6100',
        phone: '0721-774567',
        email: 'boalia@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Motihar Police Station',
        district: 'Rajshahi',
        zone: 'RMP Motihar',
        address: 'Motihar, Rajshahi-6100',
        phone: '0721-775678',
        email: 'motihar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Rajpara Police Station',
        district: 'Rajshahi',
        zone: 'RMP Rajpara',
        address: 'Rajpara, Rajshahi-6100',
        phone: '0721-772345',
        email: 'rajpara@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Paba Police Station',
        district: 'Rajshahi',
        zone: 'Paba',
        address: 'Paba, Rajshahi-6240',
        phone: '0721-778899',
        email: 'paba@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Godagari Police Station',
        district: 'Rajshahi',
        zone: 'Godagari',
        address: 'Godagari, Rajshahi-6290',
        phone: '0721-779900',
        email: 'godagari@gmail.com',
        password: 'thana@123'
    },

    // Khulna (5)
    {
        thana_name: 'Khulna Sadar Police Station',
        district: 'Khulna',
        zone: 'Khulna Sadar',
        address: 'Khulna Sadar, Khulna-9100',
        phone: '041-720123',
        email: 'khulnasadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Sonadanga Police Station',
        district: 'Khulna',
        zone: 'Sonadanga',
        address: 'Sonadanga, Khulna-9100',
        phone: '041-720456',
        email: 'sonadanga@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Khalishpur Police Station',
        district: 'Khulna',
        zone: 'Khalishpur',
        address: 'Khalishpur, Khulna-9000',
        phone: '041-721111',
        email: 'khalishpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Daulatpur Police Station',
        district: 'Khulna',
        zone: 'Daulatpur',
        address: 'Daulatpur, Khulna-9202',
        phone: '041-720789',
        email: 'daulatpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Dumuria Police Station',
        district: 'Khulna',
        zone: 'Dumuria',
        address: 'Dumuria, Khulna-9250',
        phone: '041-722222',
        email: 'dumuria@gmail.com',
        password: 'thana@123'
    },

    // Barishal (5)
    {
        thana_name: 'Barishal Sadar Police Station',
        district: 'Barishal',
        zone: 'Barishal Sadar',
        address: 'Barishal Sadar, Barishal-8200',
        phone: '0431-231234',
        email: 'barishalsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kotwali Police Station (Barishal)',
        district: 'Barishal',
        zone: 'Barishal Kotwali',
        address: 'Kotwali, Barishal-8200',
        phone: '0431-232345',
        email: 'barishalkotwali@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bakerganj Police Station',
        district: 'Barishal',
        zone: 'Bakerganj',
        address: 'Bakerganj, Barishal-8280',
        phone: '0431-233456',
        email: 'bakerganj@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Banaripara Police Station',
        district: 'Barishal',
        zone: 'Banaripara',
        address: 'Banaripara, Barishal-8530',
        phone: '0431-234567',
        email: 'banaripara@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Gournadi Police Station',
        district: 'Barishal',
        zone: 'Gournadi',
        address: 'Gournadi, Barishal-8230',
        phone: '0431-235678',
        email: 'gournadi@gmail.com',
        password: 'thana@123'
    },

    // Sylhet (5)
    {
        thana_name: 'Kotwali Police Station (Sylhet)',
        district: 'Sylhet',
        zone: 'Sylhet Kotwali',
        address: 'Kotwali, Sylhet-3100',
        phone: '0821-714567',
        email: 'sylhetkotwali@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Jalalabad Police Station',
        district: 'Sylhet',
        zone: 'Jalalabad',
        address: 'Jalalabad, Sylhet-3100',
        phone: '0821-715678',
        email: 'jalalabad@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Shah Paran Police Station',
        district: 'Sylhet',
        zone: 'Shah Paran',
        address: 'Shah Paran, Sylhet-3100',
        phone: '0821-716789',
        email: 'shahparan@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'South Surma Police Station',
        district: 'Sylhet',
        zone: 'South Surma',
        address: 'South Surma, Sylhet-3112',
        phone: '0821-717890',
        email: 'southsurma@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bishwanath Police Station',
        district: 'Sylhet',
        zone: 'Bishwanath',
        address: 'Bishwanath, Sylhet-3130',
        phone: '0821-718901',
        email: 'bishwanath@gmail.com',
        password: 'thana@123'
    },

    // Rangpur (5)
    {
        thana_name: 'Kotwali Police Station (Rangpur)',
        district: 'Rangpur',
        zone: 'Rangpur Kotwali',
        address: 'Kotwali, Rangpur-5400',
        phone: '0521-62111',
        email: 'rangpurkotwali@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Haragach Police Station',
        district: 'Rangpur',
        zone: 'Haragach',
        address: 'Haragach, Rangpur-5440',
        phone: '0521-62222',
        email: 'haragach@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Gangachara Police Station',
        district: 'Rangpur',
        zone: 'Gangachara',
        address: 'Gangachara, Rangpur-5410',
        phone: '0521-62333',
        email: 'gangachara@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Mithapukur Police Station',
        district: 'Rangpur',
        zone: 'Mithapukur',
        address: 'Mithapukur, Rangpur-5460',
        phone: '0521-62444',
        email: 'mithapukur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Badarganj Police Station',
        district: 'Rangpur',
        zone: 'Badarganj',
        address: 'Badarganj, Rangpur-5430',
        phone: '0521-62555',
        email: 'badarganj@gmail.com',
        password: 'thana@123'
    }
,

    // Narayanganj (5)
    {
        thana_name: 'Narayanganj Sadar Police Station',
        district: 'Narayanganj',
        zone: 'Narayanganj Sadar',
        address: 'Narayanganj Sadar, Narayanganj-1400',
        phone: '02-7641111',
        email: 'narayanganjsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bandar Police Station',
        district: 'Narayanganj',
        zone: 'Bandar',
        address: 'Bandar, Narayanganj-1410',
        phone: '02-7642222',
        email: 'bandar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Sonargaon Police Station',
        district: 'Narayanganj',
        zone: 'Sonargaon',
        address: 'Sonargaon, Narayanganj-1440',
        phone: '02-7643333',
        email: 'sonargaon@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Rupganj Police Station',
        district: 'Narayanganj',
        zone: 'Rupganj',
        address: 'Rupganj, Narayanganj-1460',
        phone: '02-7644444',
        email: 'rupganj@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Araihazar Police Station',
        district: 'Narayanganj',
        zone: 'Araihazar',
        address: 'Araihazar, Narayanganj-1450',
        phone: '02-7645555',
        email: 'araihazar@gmail.com',
        password: 'thana@123'
    },

    // Narsingdi (5)
    {
        thana_name: 'Narsingdi Sadar Police Station',
        district: 'Narsingdi',
        zone: 'Narsingdi Sadar',
        address: 'Narsingdi Sadar, Narsingdi-1600',
        phone: '02-9461111',
        email: 'narsingdisadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Palash Police Station',
        district: 'Narsingdi',
        zone: 'Palash',
        address: 'Palash, Narsingdi-1610',
        phone: '02-9462222',
        email: 'palash@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Shibpur Police Station',
        district: 'Narsingdi',
        zone: 'Shibpur',
        address: 'Shibpur, Narsingdi-1620',
        phone: '02-9463333',
        email: 'shibpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Raipura Police Station',
        district: 'Narsingdi',
        zone: 'Raipura',
        address: 'Raipura, Narsingdi-1630',
        phone: '02-9464444',
        email: 'raipura@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Belabo Police Station',
        district: 'Narsingdi',
        zone: 'Belabo',
        address: 'Belabo, Narsingdi-1640',
        phone: '02-9465555',
        email: 'belabo@gmail.com',
        password: 'thana@123'
    },

    // Manikganj (5)
    {
        thana_name: 'Manikganj Sadar Police Station',
        district: 'Manikganj',
        zone: 'Manikganj Sadar',
        address: 'Manikganj Sadar, Manikganj-1800',
        phone: '02-9551111',
        email: 'manikganjsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Singair Police Station',
        district: 'Manikganj',
        zone: 'Singair',
        address: 'Singair, Manikganj-1820',
        phone: '02-9552222',
        email: 'singair@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Saturia Police Station',
        district: 'Manikganj',
        zone: 'Saturia',
        address: 'Saturia, Manikganj-1810',
        phone: '02-9553333',
        email: 'saturia@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Harirampur Police Station',
        district: 'Manikganj',
        zone: 'Harirampur',
        address: 'Harirampur, Manikganj-1830',
        phone: '02-9554444',
        email: 'harirampur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Ghior Police Station',
        district: 'Manikganj',
        zone: 'Ghior',
        address: 'Ghior, Manikganj-1840',
        phone: '02-9555555',
        email: 'ghior@gmail.com',
        password: 'thana@123'
    },

    // Faridpur (5)
    {
        thana_name: 'Faridpur Sadar Police Station',
        district: 'Faridpur',
        zone: 'Faridpur Sadar',
        address: 'Faridpur Sadar, Faridpur-7800',
        phone: '0631-61111',
        email: 'faridpursadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Boalmari Police Station',
        district: 'Faridpur',
        zone: 'Boalmari',
        address: 'Boalmari, Faridpur-7860',
        phone: '0631-62222',
        email: 'boalmari@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bhanga Police Station',
        district: 'Faridpur',
        zone: 'Bhanga',
        address: 'Bhanga, Faridpur-7830',
        phone: '0631-63333',
        email: 'bhanga@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Nagarkanda Police Station',
        district: 'Faridpur',
        zone: 'Nagarkanda',
        address: 'Nagarkanda, Faridpur-7840',
        phone: '0631-64444',
        email: 'nagarkanda@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Madhukhali Police Station',
        district: 'Faridpur',
        zone: 'Madhukhali',
        address: 'Madhukhali, Faridpur-7850',
        phone: '0631-65555',
        email: 'madhukhali@gmail.com',
        password: 'thana@123'
    },

    // Rajbari (5)
    {
        thana_name: 'Rajbari Sadar Police Station',
        district: 'Rajbari',
        zone: 'Rajbari Sadar',
        address: 'Rajbari Sadar, Rajbari-7700',
        phone: '0641-61111',
        email: 'rajbarisadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Goalanda Police Station',
        district: 'Rajbari',
        zone: 'Goalanda',
        address: 'Goalanda, Rajbari-7710',
        phone: '0641-62222',
        email: 'goalanda@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Pangsha Police Station',
        district: 'Rajbari',
        zone: 'Pangsha',
        address: 'Pangsha, Rajbari-7720',
        phone: '0641-63333',
        email: 'pangsha@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kalukhali Police Station',
        district: 'Rajbari',
        zone: 'Kalukhali',
        address: 'Kalukhali, Rajbari-7730',
        phone: '0641-64444',
        email: 'kalukhali@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Baliakandi Police Station',
        district: 'Rajbari',
        zone: 'Baliakandi',
        address: 'Baliakandi, Rajbari-7740',
        phone: '0641-65555',
        email: 'baliakandi@gmail.com',
        password: 'thana@123'
    },

    // Madaripur (5)
    {
        thana_name: 'Madaripur Sadar Police Station',
        district: 'Madaripur',
        zone: 'Madaripur Sadar',
        address: 'Madaripur Sadar, Madaripur-7900',
        phone: '0661-61111',
        email: 'madaripursadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Rajoir Police Station',
        district: 'Madaripur',
        zone: 'Rajoir',
        address: 'Rajoir, Madaripur-7910',
        phone: '0661-62222',
        email: 'rajoir@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Shibchar Police Station',
        district: 'Madaripur',
        zone: 'Shibchar',
        address: 'Shibchar, Madaripur-7920',
        phone: '0661-63333',
        email: 'shibchar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kalkini Police Station',
        district: 'Madaripur',
        zone: 'Kalkini',
        address: 'Kalkini, Madaripur-7930',
        phone: '0661-64444',
        email: 'kalkini@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Dasar Police Station',
        district: 'Madaripur',
        zone: 'Dasar',
        address: 'Dasar, Madaripur-7940',
        phone: '0661-65555',
        email: 'dasar@gmail.com',
        password: 'thana@123'
    },

    // Shariatpur (5)
    {
        thana_name: 'Shariatpur Sadar Police Station',
        district: 'Shariatpur',
        zone: 'Shariatpur Sadar',
        address: 'Shariatpur Sadar, Shariatpur-8000',
        phone: '0601-61111',
        email: 'shariatpursadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Naria Police Station',
        district: 'Shariatpur',
        zone: 'Naria',
        address: 'Naria, Shariatpur-8010',
        phone: '0601-62222',
        email: 'naria@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Zajira Police Station',
        district: 'Shariatpur',
        zone: 'Zajira',
        address: 'Zajira, Shariatpur-8020',
        phone: '0601-63333',
        email: 'zajira@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bhedarganj Police Station',
        district: 'Shariatpur',
        zone: 'Bhedarganj',
        address: 'Bhedarganj, Shariatpur-8030',
        phone: '0601-64444',
        email: 'bhedarganj@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Damudya Police Station',
        district: 'Shariatpur',
        zone: 'Damudya',
        address: 'Damudya, Shariatpur-8040',
        phone: '0601-65555',
        email: 'damudya@gmail.com',
        password: 'thana@123'
    },

    // Gopalganj (5)
    {
        thana_name: 'Gopalganj Sadar Police Station',
        district: 'Gopalganj',
        zone: 'Gopalganj Sadar',
        address: 'Gopalganj Sadar, Gopalganj-8100',
        phone: '0491-61111',
        email: 'gopalganjsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kashiani Police Station',
        district: 'Gopalganj',
        zone: 'Kashiani',
        address: 'Kashiani, Gopalganj-8130',
        phone: '0491-62222',
        email: 'kashiani@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kotalipara Police Station',
        district: 'Gopalganj',
        zone: 'Kotalipara',
        address: 'Kotalipara, Gopalganj-8150',
        phone: '0491-63333',
        email: 'kotalipara@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Tungipara Police Station',
        district: 'Gopalganj',
        zone: 'Tungipara',
        address: 'Tungipara, Gopalganj-8120',
        phone: '0491-64444',
        email: 'tungipara@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Muksudpur Police Station',
        district: 'Gopalganj',
        zone: 'Muksudpur',
        address: 'Muksudpur, Gopalganj-8140',
        phone: '0491-65555',
        email: 'muksudpur@gmail.com',
        password: 'thana@123'
    },

    // Kishoreganj (5)
    {
        thana_name: 'Kishoreganj Sadar Police Station',
        district: 'Kishoreganj',
        zone: 'Kishoreganj Sadar',
        address: 'Kishoreganj Sadar, Kishoreganj-2300',
        phone: '0942-61111',
        email: 'kishoreganjsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bajitpur Police Station',
        district: 'Kishoreganj',
        zone: 'Bajitpur',
        address: 'Bajitpur, Kishoreganj-2336',
        phone: '0942-62222',
        email: 'bajitpur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Bhairab Police Station',
        district: 'Kishoreganj',
        zone: 'Bhairab',
        address: 'Bhairab, Kishoreganj-2320',
        phone: '0942-63333',
        email: 'bhairab@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Itna Police Station',
        district: 'Kishoreganj',
        zone: 'Itna',
        address: 'Itna, Kishoreganj-2330',
        phone: '0942-64444',
        email: 'itna@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Kuliarchar Police Station',
        district: 'Kishoreganj',
        zone: 'Kuliarchar',
        address: 'Kuliarchar, Kishoreganj-2340',
        phone: '0942-65555',
        email: 'kuliarchar@gmail.com',
        password: 'thana@123'
    },

    // Mymensingh (5)
    {
        thana_name: 'Mymensingh Sadar Police Station',
        district: 'Mymensingh',
        zone: 'Mymensingh Sadar',
        address: 'Mymensingh Sadar, Mymensingh-2200',
        phone: '091-61111',
        email: 'mymensinghsadar@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Muktagacha Police Station',
        district: 'Mymensingh',
        zone: 'Muktagacha',
        address: 'Muktagacha, Mymensingh-2210',
        phone: '091-62222',
        email: 'muktagacha@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Trishal Police Station',
        district: 'Mymensingh',
        zone: 'Trishal',
        address: 'Trishal, Mymensingh-2220',
        phone: '091-63333',
        email: 'trishal@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Gouripur Police Station',
        district: 'Mymensingh',
        zone: 'Gouripur',
        address: 'Gouripur, Mymensingh-2270',
        phone: '091-64444',
        email: 'gouripur@gmail.com',
        password: 'thana@123'
    },
    {
        thana_name: 'Ishwarganj Police Station',
        district: 'Mymensingh',
        zone: 'Ishwarganj',
        address: 'Ishwarganj, Mymensingh-2280',
        phone: '091-65555',
        email: 'ishwarganj@gmail.com',
        password: 'thana@123'
    }
];

const seedThanas = async () => {
    try {
        console.log('\n═══════════════════════════════════════════════');
        console.log('   🏛️  THANA DATA SEEDING SCRIPT');
        console.log('═══════════════════════════════════════════════\n');
        
        console.log('🔍 Checking for admin user ADM-0000001...\n');

        const adminId = 'ADM-0000001';
        const adminResult = await pool.query(
            'SELECT admin_id FROM admin WHERE admin_id = $1',
            [adminId]
        );

        if (adminResult.rows.length === 0) {
            console.error(`❌ Admin ${adminId} not found! Please create this admin first.`);
            process.exit(1);
        }

        console.log(`✅ Using admin_id: ${adminId}\n`);
        console.log(`Preparing to insert ${thanasData.length} thanas...\n`);
        
        const saltRounds = 10;
        let successCount = 0;
        let errorCount = 0;
        const insertedThanas = [];
        
        for (const thana of thanasData) {
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(thana.password, saltRounds);
                
                const query = `
                    INSERT INTO thana (thana_name, district, zone, address, phone, email, password, created_by_admin_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING thana_id, thana_name, district, zone;
                `;
                
                const result = await pool.query(query, [
                    thana.thana_name,
                    thana.district,
                    thana.zone,
                    thana.address,
                    thana.phone,
                    thana.email,
                    hashedPassword,
                    adminId
                ]);
                
                const insertedThana = result.rows[0];
                insertedThanas.push(insertedThana);
                
                console.log(`✅ ID ${insertedThana.thana_id}: ${insertedThana.thana_name}`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Failed to insert ${thana.thana_name}: ${error.message}`);
                errorCount++;
            }
        }
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('═══════════════════════════════════════════════');
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📈 Total: ${thanasData.length}`);
        
        // Show statistics by district
        const districtStats = await pool.query(`
            SELECT district, COUNT(*) as thana_count
            FROM thana
            GROUP BY district
            ORDER BY district
        `);
        
        console.log('\n🏛️  THANAS BY DISTRICT:\n');
        districtStats.rows.forEach(stat => {
            console.log(`   ${stat.district.padEnd(15)}: ${stat.thana_count} thanas`);
        });
        
        // Show statistics by zone
        const zoneStats = await pool.query(`
            SELECT zone, COUNT(*) as thana_count
            FROM thana
            GROUP BY zone
            ORDER BY thana_count DESC
        `);
        
        console.log('\n📍 THANAS BY ZONE:\n');
        zoneStats.rows.forEach(stat => {
            console.log(`   ${stat.zone.padEnd(15)}: ${stat.thana_count} thanas`);
        });
        
        // Show all inserted thanas grouped by district
        console.log('\n🔐 LOGIN CREDENTIALS:\n');
        console.log('   Email: [thana email from list]');
        console.log('   Password: thana@123');
        
        console.log('\n═══════════════════════════════════════════════');
        console.log('✅ Thana data seeding completed successfully!');
        console.log('═══════════════════════════════════════════════\n');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Critical Error:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedThanas();
