import React from "react";

function Footer() {
  return (
    <footer className='bg-[#92fedf] py-8 px-24 border-black border-t-2'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-3 gap-12 mb-8'>
          <div>
            <h3 className='text-lg font-semibold '>Kontak Kami</h3>
            <ul className='mt-4'>
              <li>Email: info@gowesin.com</li>
              <li>Telepon: +62 123 456 7890</li>
              <li>Jl. Setiabudi, Bandung</li>
            </ul>
          </div>

          <div>
            <h3 className='text-lg font-semibold '>Ikuti Kami</h3>
            <div className='flex space-x-4 mt-4'>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-black hover:text-gray-800'
              >
                <i className='fab fa-facebook-f text-xl'></i>
              </a>
              <a
                href='https://www.twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-black hover:text-gray-800'
              >
                <i className='fab fa-twitter text-xl'></i>
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-black hover:text-gray-800'
              >
                <i className='fab fa-instagram text-xl'></i>
              </a>
              <a
                href='https://www.linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-black hover:text-gray-800'
              >
                <i className='fab fa-linkedin-in text-xl'></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold'>Tentang Kami</h3>
            <p className=''>
              GowesIN menawarkan berbagai sepeda untuk keperluan perjalanan
              Anda. Kami berkomitmen memberikan pengalaman terbaik dalam
              peminjaman sepeda.
            </p>
          </div>
        </div>

        <div className='border-t border-gray-600 pt-6 text-center'>
          <p className='text-sm'>&copy; 2024 GowesIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
