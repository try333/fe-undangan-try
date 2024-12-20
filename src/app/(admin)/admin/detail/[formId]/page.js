'use client';
import React, { useState, useEffect } from "react";
import Image from 'next/image';
// import { z } from 'zod';
// import LoadingSpinner from '../components/LoadingSpinner'; // Adjust the path as needed
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BiDotsVertical, BiPencil } from "react-icons/bi";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

// import { BiX } from "react-icons/bi";

const Detail = ({ params }) => {

  const router = useRouter(); // Initialize the router

  const searchParams = useSearchParams()

  const success = searchParams.get('success')

  const [formData, setFormData] = useState({});
  const [listImages, setListImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // Initialize isAdmin

  const [orderImageStatus, setOrderImageStatus] = useState(false);

  const [fileName, setFileName] = useState('');


  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/forms/${params.formId}`, {
        withCredentials: true
      });
      setFormData(response.data.form);
      setIsAdmin(response.data.isAdmin);

      if (response.data.form.fileZip != null) {
        setFileName(response.data.form.fileZip);
    }
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const fetchImage = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/image-order/${params.formId}`);
    setListImages(response.data.images);
    setOrderImageStatus(response.data.order);
  };

  const downloadImage = () => {
    // Open the download link in a new tab
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/download-images/${params.formId}`;
    window.open(downloadUrl, '_blank');
  };
  const downloadZip = () => {
    // Open the download link in a new tab
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/download-zip/${params.formId}`;
    window.open(downloadUrl, '_blank');
  };

  useEffect(() => {
    fetchData();
    fetchImage()
  }, []);

  useEffect(() => {
    console.log("ListImages:", listImages)
  }, [listImages]);

  useEffect(() => {
    if (success === 'true') {
      toast({
        description: "Form Data Updated."
      });
      // Replace URL to remove the success parameter
      const url = new URL(window.location);
      url.searchParams.delete('success');
      router.replace(url.toString(), { scroll: false });
    }

  }, [success, router]);

  return (
    <>
      <div className="h-10 bg-white border-b w-full"></div>
      <div className="flex min-h-screen mx-4">
        {/* Sidebar */}
        <div className="fixed md:relative z-40 w-64 h-full bg-gray-800 md:block hidden">
          {/* <Sidebar /> */}
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-grow w-full md:pl-24">
          <div className="flex items-center justify-between p-4">
            <div>
              Detail : ID {params.formId}
            </div>
            {isAdmin === 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger className='ml-4' asChild>
                  <span className="cursor-pointer"><BiDotsVertical className="h-4 w-4" /></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => {
                    router.push(`/admin/detail/${params.formId}/edit`);
                  }}
                    className="text-center cursor-pointer" // Add cursor-pointer class
                    style={{ padding: "6px 12px" }}>
                    <span className="flex items-center">
                      <BiPencil className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>

              </DropdownMenu>
            )}
          </div>

          {isAdmin === 1 && ( // Show only if isAdmin is 1
            <div className="mb-4">
              <label className="block text-gray-700">Nomor Whatsapp Customer<span className='text-red-500'>*</span></label>
              <Input
                type="text"
                name="nomorWa"
                value={formData.nomorWa}
                className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                inputMode="numeric"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Customer <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="name"
              value={formData.name}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          {/* Mempelai Pria */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Lengkap Mempelai Pria
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="namaLengkapPria"
              value={formData.namaLengkapPria}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Panggilan Mempelai Pria
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="namaPanggilanPria"
              value={formData.namaPanggilanPria}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Orang Tua Mempelai Pria<span className='text-red-500'>*</span>
              <br></br>Ex: Bapak Rozan Dan Ibu Marlina
            </label>
            <Input
              type="text"
              name="namaOrtuPria"
              value={formData.namaOrtuPria}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tempat Lahir Mempelai Pria
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="tempatLahirPria"
              value={formData.tempatLahirPria}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal Lahir Mempelai Pria <span className='text-red-500'>*</span></label>
            <input
              type="date"
              name="tglLahirPria"
              value={formData.tglLahirPria}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          {/* Mempelai Wanita */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Lengkap Mempelai Wanita
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="namaLengkapWanita"
              value={formData.namaLengkapWanita}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Panggilan Mempelai Wanita
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="namaPanggilanWanita"
              value={formData.namaPanggilanWanita}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nama Orang Tua Mempelai Wanita<span className='text-red-500'>*</span>
              <br></br>Ex: Bapak Rozan Dan Ibu Marlina
            </label>
            <Input
              type="text"
              name="namaOrtuWanita"
              value={formData.namaOrtuWanita}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tempat Lahir Mempelai Wanita
              <span className='text-red-500'>*</span></label>
            <Input
              type="text"
              name="tempatLahirWanita"
              value={formData.tempatLahirWanita}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Tanggal Lahir Mempelai Wanita <span className='text-red-500'>*</span></label>
            <input
              type="date"
              name="tglLahirWanita"
              value={formData.tglLahirWanita}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          {/* Acara */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Tanggal dan Jam Acara (Akad / Pemberkatan )
              <span className='text-red-500'>*</span>
            </label>
            <input
              type="datetime-local"
              name="datetimeAkad"
              value={formData.datetimeAkad}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Tanggal dan Jam Acara Resepsi
              <span className='text-red-500'>*</span>
            </label>
            <input
              type="datetime-local"
              name="datetimeResepsi"
              value={formData.datetimeResepsi}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Alamat Acara Akad/Pemberkatan (Alamat)<span className='text-red-500'>*</span>
              <br></br>
              Ex: Jl Jambu  Selatan No 123
            </label>
            <Input
              type="text"
              name="alamatAkad"
              value={formData.alamatAkad}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Alamat Acara Resepsi (Alamat)<span className='text-red-500'>*</span>
              <br></br>
              Ex: Jl Jambu  Selatan No 123
            </label>
            <Input
              type="text"
              name="alamatResepsi"
              value={formData.alamatResepsi}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Tempat Acara Akad/Pemberkatan
              <span className='text-red-500'>*</span>
            </label>

            <Input
              type="text"
              name="linkSherlokAkad"
              value={formData.opsiAkad}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />

            {/* {errors.alamatResepsi && <p className="text-red-500 text-sm mt-1">{errors.alamatResepsi}</p>} */}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Tempat Acara Resepsi
              <span className='text-red-500'>*</span>
            </label>

            <Input
              type="text"
              name="linkSherlokAkad"
              value={formData.opsiResepsi}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
            {/* {errors.alamatResepsi && <p className="text-red-500 text-sm mt-1">{errors.alamatResepsi}</p>} */}
          </div>

          {/* OPTIONAL */}
          <div className="mb-4">
            <label className="block text-gray-700">
              Link Live streaming (YT)
            </label>
            <Input
              type="text"
              name="liveYt"
              value={formData.liveYt}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />

          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Username Instagram (Pria & Wanita)
            </label>
            <Input
              type="text"
              name="usernameIg"
              value={formData.usernameIg}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Nomor Rekening Jika ada tamu ingin kirim hadiah (Nama Bank Dan atas nama rekening)
            </label>
            <Input
              type="text"
              name="noRek"
              value={formData.noRek}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Alamat Rumah Jika ada Pengiriman Hadiah Dari tamu Undangan
            </label>
            <Input
              type="text"
              name="alamatHadiah"
              value={formData.alamatHadiah}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ceritakan awal bertemu</label>
            <Textarea
              name="ceritaAwal"
              value={formData.ceritaAwal}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ceritakan awal jadian</label>
            <Textarea
              name="ceritaJadian"
              value={formData.ceritaJadian}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Ceritakan awal lamaran</label>
            <Textarea
              name="ceritaLamaran"
              value={formData.ceritaLamaran}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Link Maps / Sharelok lokasi acara (Akad/Pemberkatan)
            </label>
            <Input
              type="text"
              name="linkSherlokAkad"
              value={formData.linkSherlokAkad}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Link Maps / Sharelok lokasi acara Resepsi
            </label>
            <Input
              type="text"
              name="linkSherlokResepsi"
              value={formData.linkSherlokResepsi}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Posisi Nama Penempatan Tulisan Untuk Mempelai
              <span className='text-red-500'>*</span>
            </label>

            <Input
              type="text"
              name="penempatanTulisan"
              value={formData.penempatanTulisan}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />

          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              Pilihan Thema Ceknya di{' '}
              <a href='https://sewaundangan.com/#chat_me' target='_blank' rel='noopener noreferrer' className="text-blue-500 hover:underline">
                Sewaundangan.com
              </a>
              <span className='text-red-500'>*</span>
            </label>

            <Input
              type="text"
              name="pilihanTema"
              value={formData.pilihanTema}

              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />

            {/* {errors.alamatResepsi && <p className="text-red-500 text-sm mt-1">{errors.alamatResepsi}</p>} */}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              Upload ZIP File (Max 1)
            </label>

            {fileName && (
              <div className="relative max-w-[150px] rounded border border-gray-300 overflow-hidden">
                {/* Remove button */}

                <div className="flex justify-center p-2">
                  <Image
                    src="/images/icon-zip.png"
                    alt="Image description"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="px-4 py-2">
                  <p className="text-gray-700 text-xs">
                    {fileName || 'file_name.zip'}
                  </p>
                  {/* Progress bar */}
                  <div className="relative pt-1 text-center">
                    <Button className="text-xs" onClick={() => downloadZip()}>Downlod ZIP</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Upload Foto Yang Ingin Di Tampilkan (1)</label>
            <Button onClick={() => downloadImage()}>
              {loading ? (
                <>
                  {/* <ClipLoader size={20} color="#fff" className="inline-block mr-2" /> */}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Download
                </>
              ) : (
                'Download'
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {listImages.map((src, index) => (
              <div key={index} className="flex items-center">
                {orderImageStatus && index % 2 === 0 && (
                  <div className="text-4xl font-bold text-gray-700 mr-4">
                    {Math.floor(index / 2) + 1}
                  </div>
                )}
                <div className="relative h-56 max-w-xs w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/images/${src.images.fileImage}`}
                    alt={`Image ${index}`}
                    fill
                    className="rounded-lg border border-gray-300 object-cover"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>



        </div>
      </div>
    </>
  );


}

export default Detail;