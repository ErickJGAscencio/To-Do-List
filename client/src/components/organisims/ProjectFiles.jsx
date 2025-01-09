import React from 'react'
import TitleLabel from '../atoms/TitleLabel'
import { FaDownload, FaFile, FaUpload } from 'react-icons/fa'
import SubTitleLabel from '../atoms/SubTitleLabel'
import Label from '../atoms/Label'

function ProjectFiles({ files, handleFileChange }) {
  return (
    <div className="card-section">
      <Label text='Documents & Files' type='paragraph' />
      <div className="files-items">

        {files.map((file, index) => (
          <div className="file-item" key={index}>
            <div className="icon-namedoc">
              <SubTitleLabel label={<FaFile />} />
              <SubTitleLabel label={file.name} />
            </div>
            <SubTitleLabel label={<FaDownload />} />
          </div>
        ))}
      </div>

      <input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input" />
      <button
        className={'white-button'}
        onClick={() => document.getElementById('file-input').click()}>
        <FaUpload />Upload File
      </button>
    </div>
  )
}

export default ProjectFiles