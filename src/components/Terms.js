import React from 'react'
import { Link } from 'react-router-dom'
import Usericon from "./user.png"
import { useTranslation } from 'react-i18next';
import './i18n'; // import the i18n configuration
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';
const Terms = () => {
  const { t } = useTranslation();

  return (
    <div>

      <div className="termscontainer">
        <h1 className="heading">Terms & Conditions</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe amet nesciunt magni ipsam suscipit, at quod, veritatis perspiciatis error reiciendis sequi, hic velit quo vel? Temporibus earum consequuntur delectus iusto magni! Quasi eum aperiam quisquam neque atque eligendi magni necessitatibus illum labore! Voluptates perferendis, voluptas hic repudiandae soluta natus culpa voluptate est, maiores nesciunt cumque ducimus nostrum facere nemo? Quasi voluptatibus quos mollitia exercitationem aliquid modi repudiandae cupiditate ea, recusandae ad rerum labore necessitatibus nisi explicabo in maxime. Doloremque exercitationem inventore voluptas eius ipsa. Placeat iste molestias laborum nisi reiciendis perferendis nihil, commodi quaerat sunt harum repellendus iure ratione ducimus.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quae dolore accusamus dolorem non molestiae? Rem accusamus quam quod libero quae ipsam quidem, esse iure suscipit quis, rerum laboriosam, optio id nobis eaque error. Omnis exercitationem illo iusto dignissimos, sequi quia eum debitis repudiandae culpa ab. Sed itaque iusto veritatis. Illo et amet ipsam odio necessitatibus dolorum autem ea, officia ex quo possimus eveniet vel tempore, voluptatem ab expedita vitae. Ex, non nulla facilis similique repudiandae quos aut. Deleniti illo quo, amet modi vitae nisi reprehenderit vero? Optio minus quo ducimus, quisquam tempora eaque quaerat tempore expedita, cumque velit delectus.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis nam, consequuntur ut sequi similique a commodi neque tenetur vero ea earum dolorem quibusdam esse nesciunt labore id? Illum incidunt temporibus error, sunt culpa ad eaque quidem quo magni omnis odit ullam expedita in minima saepe, amet adipisci corrupti ipsum, numquam dolores ipsam. A eaque quis rem dignissimos deserunt iste. Ex eius alias corrupti, debitis reprehenderit libero iusto reiciendis, quis assumenda cumque saepe quasi nemo nesciunt qui quam commodi, vitae a similique magni voluptatum quae aliquid cum adipisci et. Repellendus inventore totam iste dolorem laudantium at aperiam dicta voluptatibus numquam blanditiis. Mollitia tempore sunt ipsa error neque quidem quasi. Fuga, dolores dolor officia quas repellat necessitatibus sit natus? Eius suscipit pariatur eaque numquam. Ad, commodi officiis error, harum porro magni iusto consequatur incidunt, reprehenderit aspernatur eius! Ut est voluptatibus nisi! Nobis accusamus tenetur inventore quod eum praesentium unde voluptate, corrupti totam impedit iusto quia aliquam distinctio voluptates aspernatur voluptatem, libero vitae voluptatibus, sequi cupiditate quo quasi? Cumque perferendis, veritatis, laudantium eveniet repudiandae qui suscipit itaque odio modi sapiente labore, doloribus nostrum architecto culpa. Sit ab velit aliquam aliquid odit quibusdam eveniet repudiandae, nostrum voluptatem ad? Beatae modi ut accusamus fugit blanditiis corporis non dolore iusto animi repellat nobis, nostrum illo voluptates obcaecati dolor temporibus magni excepturi! Quis iste iusto animi aliquid pariatur sit perferendis, ut incidunt sint, ipsum, eum dolore at.</p>

      </div>

      <Footer/>
    </div>
  )
}

export default Terms