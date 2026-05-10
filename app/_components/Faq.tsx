"use client";

import React, { useState } from "react";

const faqItems = [
  {
    question: "Siapa saja yang boleh mengikuti lomba HIMATIC?",
    answer:
      "Lomba HIMATIC terbuka untuk seluruh mahasiswa aktif jenjang S1, D4, dan D3 dari perguruan tinggi manapun di Indonesia. Peserta harus terdaftar sebagai mahasiswa aktif pada saat pendaftaran.",
  },
  {
    question: "Apakah boleh mendaftar lebih dari satu lomba?",
    answer:
      "Boleh! Peserta diperkenankan untuk mendaftar di lebih dari satu kategori lomba, selama mampu memenuhi persyaratan dan jadwal masing-masing lomba. Namun, setiap peserta hanya boleh terdaftar di satu tim per kategori lomba.",
  },
  {
    question: "Bagaimana cara mendaftar dan apa saja syaratnya?",
    answer:
      'Pendaftaran dilakukan secara online melalui website ini dengan mengklik tombol "Daftar". Siapkan KTM/surat keterangan aktif, identitas anggota tim, dan bukti pembayaran biaya pendaftaran. Formulir akan tersedia saat periode pendaftaran dibuka.',
  },
  {
    question: "Apakah lomba dilaksanakan secara online atau offline?",
    answer:
      "Babak penyisihan dilaksanakan secara online, sehingga peserta dapat mengikuti dari mana saja. Babak final akan dilaksanakan secara offline (luring) di kampus penyelenggara. Informasi detail akan disampaikan saat Technical Meeting.",
  },
  {
    question: "Apakah ada hadiah untuk pemenang?",
    answer:
      "Tentu! Tersedia hadiah menarik berupa uang tunai, sertifikat, dan merchandise eksklusif untuk juara 1, 2, dan 3 di setiap kategori lomba. Seluruh peserta juga akan mendapatkan e-sertifikat partisipasi.",
  },
];

function FaqItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: (typeof faqItems)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div
      className={`border border-yellow-400/20 bg-[#141728] rounded-sm relative overflow-hidden transition-all duration-300 ${
        isOpen ? "border-yellow-400/50" : "hover:border-yellow-400/40"
      }`}
    >
      {/* Pixel corner accents */}
      <div
        className={`absolute top-0 left-0 w-2.5 h-2.5 transition-colors duration-300 ${
          isOpen ? "bg-yellow-400" : "bg-yellow-400/30"
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-2.5 h-2.5 transition-colors duration-300 ${
          isOpen ? "bg-yellow-400" : "bg-yellow-400/30"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-2.5 h-2.5 transition-colors duration-300 ${
          isOpen ? "bg-yellow-400" : "bg-yellow-400/30"
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-2.5 h-2.5 transition-colors duration-300 ${
          isOpen ? "bg-yellow-400" : "bg-yellow-400/30"
        }`}
      />

      {/* Question button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 md:px-6 py-4 md:py-5 text-left cursor-pointer"
      >
        {/* Index number */}
        <span className="font-game text-yellow-400/30 text-2xl md:text-3xl select-none shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question text */}
        <span className="font-game text-white text-base md:text-xl flex-1">
          {item.question}
        </span>

        {/* Toggle icon - pixel style */}
        <span
          className={`font-game text-yellow-400 text-2xl shrink-0 transition-transform duration-300 select-none ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 md:px-6 pb-5 md:pb-6 pl-14 md:pl-[4.5rem]">
          <div className="border-l-2 border-yellow-400/30 pl-4">
            <p className="text-white/60 text-sm md:text-base font-sans leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-24"
      style={{ backgroundColor: "#0c0e17" }}
    >
      {/* Section Title */}
      <div className="text-center mb-14 md:mb-20">
        <h2
          className="font-game text-yellow-400 text-4xl md:text-5xl tracking-wide inline-block"
          style={{
            textShadow:
              "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
          }}
        >
          {"< FAQ />"}
        </h2>
        {/* Pixel divider */}
        <div className="flex items-center justify-center gap-1 mt-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-yellow-400"
              style={{
                width: i === 3 ? "12px" : "6px",
                height: i === 3 ? "12px" : "6px",
                opacity:
                  i === 0 || i === 6
                    ? 0.3
                    : i === 1 || i === 5
                      ? 0.5
                      : i === 2 || i === 4
                        ? 0.7
                        : 1,
              }}
            />
          ))}
        </div>
        <p className="font-sans text-white/50 text-sm md:text-base mt-4 max-w-xl mx-auto">
          Pertanyaan yang sering ditanyakan seputar lomba HIMATIC.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        {faqItems.map((item, index) => (
          <FaqItem
            key={index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          />
        ))}
      </div>
    </section>
  );
}

export default Faq;
